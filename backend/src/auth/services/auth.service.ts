import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../providers/bcrypt.service';
import { CryptoService } from '../providers/crypto.service';
import { LoginBodyDto } from '../dtos/login.body.dto';
import { User } from 'src/user/entities/user.entity';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { RegisterBodyDto } from '../dtos/register.body.dto';
import { AuthEnum } from 'src/common/enums/auth.enum';
import { EmailService } from 'src/email/email.service';
import { SmsService } from 'src/sms/sms.service';
import { EmailName } from 'src/common/enums/email-name.enum';
import { ResetPasswordDto } from '../dtos/reset-password.body.dto';
import { RandomHelper } from 'src/common/utils/random.helper';
import { ServiceHelper } from 'src/common/utils/service.helper';
import { UserProvider } from 'src/user/providers/user.provider';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userProvider: UserProvider,
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
                user = await this.userProvider.findByEmail(loginData.email);
            } else {
                user = await this.userProvider.findByPhoneNumber(loginData.phoneNumber);
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
           ServiceHelper.handleServiceError(error, ErrorMessages.LOGIN_FAILED);
        }
    }


    async register(registerData: RegisterBodyDto) {
        try {
            // Check if user with email, username or phone number already exists
            const userWithEmail = await this.userProvider.findByEmail(registerData.email);
            if (userWithEmail) {
                throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
            }

            const userWithPhoneNumber = await this.userProvider.findByPhoneNumber(registerData.phoneNumber);
            if (userWithPhoneNumber) {
                throw new BadRequestException(ErrorMessages.PHONE_NUMBER_ALREADY_EXISTS);
            }

            const userWithUsername = await this.userProvider.findByUsername(registerData.username);
            if (userWithUsername) {
                throw new BadRequestException(ErrorMessages.USERNAME_ALREADY_EXISTS);
            }

            // Hash Password
            const hashedPassword = await this.bcryptService.hashPassword(registerData.password);
            registerData.password = hashedPassword;

            registerData.username = registerData.username.toLowerCase();

            // Create user
            await this.userProvider.create(registerData);
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.REGISTER_FAILED);
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

            if(!deviceId){
                throw new UnauthorizedException(ErrorMessages.NO_DEVICE_ID);
            }

            // Check if session exists and is valid
            const session = await this.sessionService.getSession(payload.userId, deviceId);
            if (!session || session.refreshToken !== payload.refreshToken) {
                throw new UnauthorizedException(ErrorMessages.SESSION_EXPIRED);
            }

            // Get user by id
            const user = await this.userProvider.findById(payload.userId);
            if (!user) {
                throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            // Get access token
            const accessToken = this.jwtService.sign({ userId: user.id, deviceId }, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRATION });
            return { accessToken };
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.INVALID_REFRESH_TOKEN);
        }
    }

    async sendEmailVerificationCode(email: string) {
        try {
            // Find user by email
            const user = await this.userProvider.findByEmail(email);
            if (!user) {
                throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
            }

            // Save email verification code to session
            const code = RandomHelper.generateRandomNumber(4).toString();
            await this.sessionService.setVerificationCode(`email-verification:${email}`, code);

            // Send email verification code
            this.emailService.sendEmail({
                to: email,
                subject: 'Email Verification Code',
                template: EmailName.VERIFY_EMAIL,
                data: { code }
            });
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.SEND_EMAIL_VERIFICATION_CODE_FAILED);
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
            await this.userProvider.updateEmailVerificationStatus(email);
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.ERROR_VERIFYING_EMAIL);
        }
    }

    async sendPhoneVerificationCode(phoneNumber: string) {
        try {
            // Find user by phone number
            const user = await this.userProvider.findByPhoneNumber(phoneNumber);
            if (!user) {
                throw new BadRequestException(ErrorMessages.PHONE_NUMBER_NOT_FOUND);
            }

            // Save phone verification code to session
            const code = RandomHelper.generateRandomNumber(4).toString();
            await this.sessionService.setVerificationCode(`phone-verification:${phoneNumber}`, code);

            // Send phone verification code
            this.smsService.sendSms(phoneNumber, `Your phone verification code is ${code}`);
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.SEND_PHONE_VERIFICATION_CODE_FAILED);
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
            await this.userProvider.updatePhoneNumberVerificationStatus(phoneNumber);
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.ERROR_VERIFYING_PHONE_NUMBER);
        }
    }

    async sendPasswordResetCode(email: string, phoneNumber: string) {
        try {
            // Find user by email or phone number
            let user: User;
            if (email) {
                user = await this.userProvider.findByEmail(email);
            } else {
                user = await this.userProvider.findByPhoneNumber(phoneNumber);
            }
            if (!user) {
                throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
            }

            // Save password reset code to session
            const code = RandomHelper.generateRandomNumber(4).toString();
            await this.sessionService.setVerificationCode(`password-reset:${email || phoneNumber}`, code);

            // Send password reset code
            if (email) {
                this.emailService.sendEmail({
                    to: email,
                    subject: 'Password Reset Code',
                    template: EmailName.PASSWORD_RESET,
                    data: { code }
                });
            } else {
                this.smsService.sendSms(phoneNumber, `Your password reset code is ${code}`);
            }
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.ERROR_SENDING_PASSWORD_RESET_CODE);
        }
    }

    async resetPassword({ email, phoneNumber, code, password }: ResetPasswordDto) {
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
                await this.userProvider.updatePasswordByEmail(email, hashedPassword);
            } else {
                await this.userProvider.updatePasswordByPhoneNumber(phoneNumber, hashedPassword);
            }
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.ERROR_RESETTING_PASSWORD);
        }
    }

    async logout(deviceId: string) {
        try {
            await this.sessionService.deleteSessionByDeviceId(deviceId);
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.SINGLE_LOGOUT_FAILED);
        }
    }

    async logoutAll(userId: string) {
        try {
            await this.sessionService.deleteAllSessions(userId);
            return true;
        } catch (error) {
            ServiceHelper.handleServiceError(error, ErrorMessages.LOGOUT_ALL_FAILED);
        }
    }

    verifySession(userId: string, deviceId: string) {
        return { userId, deviceId };
    }
}
