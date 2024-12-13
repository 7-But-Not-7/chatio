import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDto } from '../dtos/login.body.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SuccessMessages } from 'src/common/enums/success-messages.enum';
import { RegisterBodyDto } from '../dtos/register.body.dto';
import { EmailDto } from '../dtos/email.body.dto';
import { VerifyEmailDto } from '../dtos/verify-email.body.dto';
import { PhoneDto } from '../dtos/phone.body.dto';
import { VerifyPhoneDto } from '../dtos/verify-phone.body.dto';
import { EmailorPhoneDto } from '../dtos/email-phone.opt.dto';
import { ResetPasswordDto } from '../dtos/reset-password.body.dto';
import { AuthEndpoints } from 'src/common/enums/endpoints.enum';
import { JwtAuthGuard } from '../guards/auth.guard';
import { AuthenticatedRequest } from '..';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

  // Login route
  @Post(AuthEndpoints.LOGIN)
  @HttpCode(HttpStatus.OK)
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
  @Post(AuthEndpoints.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerData: RegisterBodyDto) {
    await this.authService.register(registerData);
    return new ResponseDto(SuccessMessages.REGISTRATION_SUCCESSFUL);
  }

  // Refresh Token route
  @Post(AuthEndpoints.REFRESH_TOKEN)
  @HttpCode(201)
  async refreshToken(@Headers('x-device-id') deviceId: string, @Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const result = await this.authService.refreshToken(refreshToken, deviceId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get("isProduction"),
      sameSite: 'lax',
    });
    res.send(new ResponseDto(SuccessMessages.REFRESH_TOKEN_SUCCESSFUL, result));
  }

  // Email Verification Code route
  @Post(AuthEndpoints.EMAIL_VERIFICATION)
  @HttpCode(HttpStatus.OK)
  async sendEmailVerificationCode(@Body() emailDto: EmailDto) {
    await this.authService.sendEmailVerificationCode(emailDto.email);
    return new ResponseDto(SuccessMessages.EMAIL_VERIFICATION_CODE_SENT);
  }

  // Verify Email route
  @Post(AuthEndpoints.VERIFY_EMAIL)
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.authService.verifyEmail(verifyEmailDto.email, verifyEmailDto.code);
    return new ResponseDto(SuccessMessages.VERIFY_EMAIL_SUCCESSFUL);
  }

  // Phone Verification Code route
  @Post(AuthEndpoints.PHONE_VERIFICATION)
  @HttpCode(HttpStatus.OK)
  async sendPhoneVerificationCode(@Body() phoneDto: PhoneDto) {
    await this.authService.sendPhoneVerificationCode(phoneDto.phoneNumber);
    return new ResponseDto(SuccessMessages.PHONE_VERIFICATION_CODE_SENT);
  }

  // Verify Phone route
  @Post(AuthEndpoints.VERIFY_PHONE)
  async verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto) {
    await this.authService.verifyPhoneNumber(verifyPhoneDto.phoneNumber, verifyPhoneDto.code);
    return new ResponseDto(SuccessMessages.VERIFY_PHONE_SUCCESSFUL);
  }

  // Send Password Reset Code route
  @Post(AuthEndpoints.FORGOT_PASSWORD)
  @HttpCode(HttpStatus.OK)
  async sendPasswordResetCode(@Body() emailOrPhoneDto: EmailorPhoneDto) {
    await this.authService.sendPasswordResetCode(emailOrPhoneDto.email, emailOrPhoneDto.phoneNumber);
    return new ResponseDto(SuccessMessages.PASSWORD_RESET_CODE_SENT);
  }

  // Reset Password route
  @Post(AuthEndpoints.RESET_PASSWORD)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return new ResponseDto(SuccessMessages.PASSWORD_RESET_SUCCESSFUL);
  }

  // Logout route
  @Post(AuthEndpoints.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers('x-device-id') deviceId: string, @Req() req: Request) {
    await this.authService.logout(deviceId);
    return new ResponseDto(SuccessMessages.SINGLE_LOGOUT_SUCCESSFUL);
  }

  // Logout All route
  @UseGuards(JwtAuthGuard)
  @Post(AuthEndpoints.LOGOUT_ALL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Req() req: AuthenticatedRequest) {
    await this.authService.logoutAll(req.authInfo.userId);
    return new ResponseDto(SuccessMessages.LOGOUT_ALL_SUCCESSFUL);
  }

  // Verify Session route
  @UseGuards(JwtAuthGuard)
  @Get(AuthEndpoints.VERIFY_SESSION)
  @HttpCode(HttpStatus.OK)
  async verifySession(@Req() req: AuthenticatedRequest) {
    const result = this.authService.verifySession(req.authInfo.userId, req.authInfo.deviceId);
    return new ResponseDto(SuccessMessages.SESSION_VALID, result);
  }
}
