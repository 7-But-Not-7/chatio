import { Body, Controller, Get, Headers, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dtos/login.body.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SuccessMessages } from 'src/common/enums/success-messages.enum';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { EmailDto } from './dtos/email.body.dto';
import { VerifyEmailDto } from './dtos/verify-email.body.dto';
import { PhoneDto } from './dtos/phone.body.dto';
import { VerifyPhoneDto } from './dtos/verify-phone.body.dto';
import { EmailorPhoneDto } from './dtos/email-phone.opt.dto';
import { ResetPasswordDto } from './dtos/reset-password.body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

  // Login route
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginBodyDto, @Headers('x-device-id') deviceId: string, @Res() res: Response) {
    const result = await this.authService.login(loginData, deviceId);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get("isProduction"),
      sameSite: 'lax',
    });

    const val = new ResponseDto(SuccessMessages.LOGIN_SUCCESSFUL, { accessToken: result.accessToken });
    res.send(val);
  }

  // Register route
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerData: RegisterBodyDto) {
    await this.authService.register(registerData);
    return new ResponseDto(SuccessMessages.REGISTRATION_SUCCESSFUL);
  }

  // Refresh Token route
  @Post('refresh-token')
  @HttpCode(201)
  async refreshToken(@Headers('x-device-id') deviceId: string, @Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;
    const result = await this.authService.refreshToken(deviceId, refreshToken);
    return new ResponseDto(SuccessMessages.REFRESH_TOKEN_SUCCESSFUL, result);
  }

  // Email Verification Code route
  @Post('email-verification')
  @HttpCode(200)
  async sendEmailVerificationCode(@Body() emailDto: EmailDto) {
    await this.authService.sendEmailVerificationCode(emailDto.email);
    return new ResponseDto(SuccessMessages.EMAIL_VERIFICATION_CODE_SENT);
  }

  // Verify Email route
  @Post('verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.authService.verifyEmail(verifyEmailDto.email, verifyEmailDto.code);
    return new ResponseDto(SuccessMessages.VERIFY_EMAIL_SUCCESSFUL);
  }

  // Phone Verification Code route
  @Post('phone-verification')
  @HttpCode(200)
  async sendPhoneVerificationCode(@Body() phoneDto: PhoneDto) {
    await this.authService.sendPhoneVerificationCode(phoneDto.phoneNumber);
    return new ResponseDto(SuccessMessages.PHONE_VERIFICATION_CODE_SENT);
  }

  // Verify Phone route
  @Post('verify-phone')
  async verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto) {
    await this.authService.verifyPhoneNumber(verifyPhoneDto.phoneNumber, verifyPhoneDto.code);
    return new ResponseDto(SuccessMessages.VERIFY_PHONE_SUCCESSFUL);
  }

  // Send Password Reset Code route
  @Post('forgot-password')
  @HttpCode(200)
  async sendPasswordResetCode(@Body() emailOrPhoneDto: EmailorPhoneDto) {
    await this.authService.sendPasswordResetCode(emailOrPhoneDto.email, emailOrPhoneDto.phoneNumber);
    return new ResponseDto(SuccessMessages.PASSWORD_RESET_CODE_SENT);
  }

  // Reset Password route
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return new ResponseDto(SuccessMessages.PASSWORD_RESET_SUCCESSFUL);
  }

}
