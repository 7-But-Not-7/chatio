import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';
import { BcryptService } from './services/bcrypt.service';
import { CryptoService } from './services/crypto.service';
import { LoginBodyDto } from './dtos/login.body.dto';
import { User } from 'src/user/entities/user.entity';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { AuthEnum } from 'src/common/enums/auth.enum';
import { EmailService } from 'src/email/email.service';
import { SmsService } from 'src/sms/sms.service';
import { EmailName } from 'src/common/enums/email-name.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly bcryptService: BcryptService,
        private readonly cryptoService: CryptoService,
        private readonly emailService: EmailService,
        private readonly smsService: SmsService
    ) { }

    async login(loginData: LoginBodyDto, deviceId: string) {
        try {
            // Check if device id is provided
            if(!deviceId){
                throw new BadRequestException(ErrorMessages.NO_DEVICE_ID);
            }
            if (!loginData.email && !loginData.phoneNumber) {
                throw new UnauthorizedException(ErrorMessages.INVALID_LOGIN_CREDENTIALS);
            }
            // Find user by email or phone number
            let user: User;
            if (loginData.email) {
                user = await this.userService.findByEmail(loginData.email);
            } else {
                user = await this.userService.findByPhoneNumber(loginData.phoneNumber);
            }
            if (!user) {
                throw new UnauthorizedException(ErrorMessages.INVALID_LOGIN_CREDENTIALS);
            }
    
            const isPasswordValid = await this.bcryptService.comparePassword(loginData.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException(ErrorMessages.INVALID_LOGIN_CREDENTIALS);
            }
    
            // Get access and refresh tokens
            const accessToken = this.jwtService.sign({ userId: user.id, deviceId }, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRATION });
            const _refreshToken = this.cryptoService.random();
            const jwtrefreshToken = this.jwtService.sign({ userId: user.id, deviceId, refreshToken: _refreshToken }, { expiresIn: AuthEnum.REFRESH_TOKEN_EXPIRATION });
            const refreshToken = this.cryptoService.encrypt(jwtrefreshToken);
            await this.sessionService.createSession(user.id, deviceId, { userId: user.id, deviceId, refreshToken: _refreshToken, device: loginData.device });
            return { accessToken, refreshToken };
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.LOGIN_FAILED);
        }
    }


    async register(registerData: RegisterBodyDto) {
        try {
            // Check if user with email or phone number already exists
            const userWithEmail = await this.userService.findByEmail(registerData.email);
            if (userWithEmail) {
                throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
            }
    
            const userWithPhoneNumber = await this.userService.findByPhoneNumber(registerData.phoneNumber);
            if (userWithPhoneNumber) {
                throw new BadRequestException(ErrorMessages.PHONE_NUMBER_ALREADY_EXISTS);
            }
    
            // Hash Password
            const hashedPassword = await this.bcryptService.hashPassword(registerData.password);
            registerData.password = hashedPassword;
    
            // Create user
            await this.userService.create(registerData);
            return true;
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.REGISTER_FAILED);
        }
    }

    async refreshToken(refreshToken: string, deviceId: string) {}

    async sendEmailVerificationCode(email: string) {
        try {
            // Find user by email
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
            }
    
            // Send email verification code
            const code = this.cryptoService.random(4);
            await this.emailService.sendEmail({
                to: email,
                subject: 'Email Verification Code',
                template: EmailName.VERIFY_EMAIL,
                data: {code}
            });
            return true;
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.SEND_EMAIL_VERIFICATION_CODE_FAILED);
        }
    }

    async verifyEmail(email: string, code: string) {}

    async sendPhoneVerificationCode(phoneNumber: string) {}

    async verifyPhoneNumber(phoneNumber: string, code: string) {}

    async sendPasswordResetCode(email: string) {}

    async resetPassword(email: string, code: string, password: string) {}

}
