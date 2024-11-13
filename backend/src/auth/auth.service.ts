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
import { ResetPasswordDto } from './dtos/reset-password.body.dto';

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
            if (!deviceId) {
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
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.LOGIN_FAILED);
        }
    }


    async register(registerData: RegisterBodyDto) {
        try {
            // Check if user with email, username or phone number already exists
            const userWithEmail = await this.userService.findByEmail(registerData.email);
            if (userWithEmail) {
                throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
            }

            const userWithPhoneNumber = await this.userService.findByPhoneNumber(registerData.phoneNumber);
            if (userWithPhoneNumber) {
                throw new BadRequestException(ErrorMessages.PHONE_NUMBER_ALREADY_EXISTS);
            }

            const userWithUsername = await this.userService.findByUsername(registerData.username);
            if (userWithUsername) {
                throw new BadRequestException(ErrorMessages.PHONE_NUMBER_ALREADY_EXISTS);
            }

            // Hash Password
            const hashedPassword = await this.bcryptService.hashPassword(registerData.password);
            registerData.password = hashedPassword;

            // Create user
            await this.userService.create(registerData);
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.REGISTER_FAILED);
        }
    }

    async refreshToken(refreshToken: string, deviceId: string) {
        try {
            // Decrypt refresh token
            const decryptedRefreshToken = this.cryptoService.decrypt(refreshToken);
            if (!decryptedRefreshToken) {
                throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            // Verify refresh token
            const payload = this.jwtService.verify(decryptedRefreshToken);
            if (!payload || payload.deviceId !== deviceId) {
                throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            // Check if session exists and is valid
            const session = await this.sessionService.getSession(payload.userId, deviceId);
            if (!session || session.refreshToken !== payload.refreshToken) {
                throw new UnauthorizedException(ErrorMessages.SESSION_EXPIRED);
            }

            // Get user by id
            const user = await this.userService.findById(payload.userId);
            if (!user) {
                throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            // Get access token
            const accessToken = this.jwtService.sign({ userId: user.id, deviceId }, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRATION });
            return { accessToken };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.INVALID_REFRESH_TOKEN);
        }
     }

    async sendEmailVerificationCode(email: string) {
        try {
            // Find user by email
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
            }

            // Save email verification code to session
            const code = this.cryptoService.random(4);
            await this.sessionService.setVerificationCode(`email-verification:${email}`, code);

            // Send email verification code
            await this.emailService.sendEmail({
                to: email,
                subject: 'Email Verification Code',
                template: EmailName.VERIFY_EMAIL,
                data: { code }
            });
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.SEND_EMAIL_VERIFICATION_CODE_FAILED);
        }
    }

    async verifyEmail(email: string, code: string) {
        try {
            // Check if email verification code is valid
            const savedCode = await this.sessionService.getVerificationCode(`email-verification:${email}`);
            if (!savedCode || savedCode !== code) {
                throw new BadRequestException(ErrorMessages.INVALID_EMAIL_VERIFICATION_CODE);
            }

            // Update user email verification status
            await this.userService.updateEmailVerificationStatus(email);
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.ERROR_VERIFYING_EMAIL);
        }
    }

    async sendPhoneVerificationCode(phoneNumber: string) {
        try {
            // Find user by phone number
            const user = await this.userService.findByPhoneNumber(phoneNumber);
            if (!user) {
                throw new BadRequestException(ErrorMessages.PHONE_NUMBER_NOT_FOUND);
            }

            // Save phone verification code to session
            const code = this.cryptoService.random(4);
            await this.sessionService.setVerificationCode(`phone-verification:${phoneNumber}`, code);

            // Send phone verification code
            await this.smsService.sendSms(phoneNumber, `Your phone verification code is ${code}`);
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.SEND_PHONE_VERIFICATION_CODE_FAILED);
        }
    }

    async verifyPhoneNumber(phoneNumber: string, code: string) {
        try {
            // Check if phone verification code is valid
            const savedCode = await this.sessionService.getVerificationCode(`phone-verification:${phoneNumber}`);
            if (!savedCode || savedCode !== code) {
                throw new BadRequestException(ErrorMessages.INVALID_PHONE_VERIFICATION_CODE);
            }

            // Update user phone verification status
            await this.userService.updatePhoneNumberVerificationStatus(phoneNumber);
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.ERROR_VERIFYING_PHONE_NUMBER);
        }
    }

    async sendPasswordResetCode(email: string, phoneNumber: string) {
        try {
            // Find user by email or phone number
            let user: User;
            if (email) {
                user = await this.userService.findByEmail(email);
            } else {
                user = await this.userService.findByPhoneNumber(phoneNumber);
            }
            if (!user) {
                throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
            }

            // Save password reset code to session
            const code = this.cryptoService.random(4);
            await this.sessionService.setVerificationCode(`password-reset:${email || phoneNumber}`, code);

            // Send password reset code
            if (email) {
                await this.emailService.sendEmail({
                    to: email,
                    subject: 'Password Reset Code',
                    template: EmailName.PASSWORD_RESET,
                    data: { code }
                });
            } else {
                await this.smsService.sendSms(phoneNumber, `Your password reset code is ${code}`);
            }
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.SEND_PHONE_VERIFICATION_CODE_FAILED);
        }
    }

    async resetPassword({email, phoneNumber, code, password}: ResetPasswordDto) {
        try {
            // Check code by email or phone number
            let savedCode: string;
            if (email) {
                savedCode = await this.sessionService.getVerificationCode(`password-reset:${email}`);
            } else {
                savedCode = await this.sessionService.getVerificationCode(`password-reset:${phoneNumber}`);
            }
            if (!savedCode || savedCode !== code) {
                throw new BadRequestException(ErrorMessages.INVALID_PASSWORD_RESET_CODE);
            }

            // Hash Password
            const hashedPassword = await this.bcryptService.hashPassword(password);
            if (email) {
                await this.userService.updatePasswordByEmail(email, hashedPassword);
            } else {
                await this.userService.updatePasswordByPhoneNumber(phoneNumber, hashedPassword);
            }
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ErrorMessages.ERROR_RESETTING_PASSWORD);
        }
    }

}
