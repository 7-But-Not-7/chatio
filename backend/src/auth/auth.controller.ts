import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dtos/login.body.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SuccessMessages } from 'src/common/enums/success-messages.enum';
import { RegisterBodyDto } from './dtos/register.body.dto';
import { EmailDto } from './dtos/email.body.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

  // Login route
  @Post('login')
  async login(@Body() loginData: LoginBodyDto, @Headers('x-device-id') deviceId: string, @Res() res: Response) {
    const result = await this.authService.login(loginData, deviceId);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: this.configService.get("isProduction"),
      sameSite: 'lax',
    });
    
    const val = new ResponseDto(SuccessMessages.LOGIN_SUCCESSFUL, {accessToken: result.accessToken});
    res.send(val);
  }

  // Register route
  @Post('register')
  async register(@Body() registerData: RegisterBodyDto) {
    await this.authService.register(registerData);
    return new ResponseDto(SuccessMessages.REGISTRATION_SUCCESSFUL);
  }

  // Email Verification Code route
  @Post('email-verification')
  async sendEmailVerificationCode(@Body() emailDto: EmailDto) {
    await this.authService.sendEmailVerificationCode(emailDto.email);
    return new ResponseDto(SuccessMessages.EMAIL_VERIFICATION_CODE_SENT);
  }

}
