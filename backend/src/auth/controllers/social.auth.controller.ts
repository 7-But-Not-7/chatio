// src/auth/controllers/social-auth.controller.ts
import { Controller, Get, UseGuards, Req, Query, HttpCode, Res, Redirect, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SocialAuthService } from '../services/social.auth.service';
import { DeviceDto } from '../dtos/device.data.dto';
import { AuthEndpoints } from 'src/common/enums/endpoints.enum';
import { GoogleProfile } from '..';
import { ParseAndValidate } from 'src/common/pipes/parse-validate.pipe';

@Controller('auth')
export class SocialAuthController {
  constructor(
    private readonly socialAuthService: SocialAuthService,
    private readonly configService: ConfigService
  ) { }

  @Get(AuthEndpoints.GOOGLE_AUTH)
  @Redirect()
  async googleAuth(@Query('device', new ParseAndValidate(DeviceDto)) device: string, @Res() res: Response) {
    //Save Device Info
    let deviceData = device as unknown as DeviceDto;
    await this.socialAuthService.saveDeviceInfo(deviceData);
    res.cookie('deviceId', deviceData.id, {
      httpOnly: true,
      secure: this.configService.get("isProduction"),
      sameSite: 'lax',
    });
    return { url: AuthEndpoints.GOOGLE_REDIRECT, statusCode: HttpStatus.FOUND };
  }

  @Get(AuthEndpoints.GOOGLE_REDIRECT)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect() { }

  @Get(AuthEndpoints.GOOGLE_AUTH_CALLBACK)
  @UseGuards(AuthGuard('google'))
  @HttpCode(200)
  async googleAuthCallback(
    @Req() req: Request & { user: GoogleProfile },
    @Res() res: Response
  ) {
    const { accessToken, refreshToken } = await this.socialAuthService.createOrLogin(req.user, req.cookies.deviceId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get("isProduction"),
      sameSite: 'lax',
    });

    res.redirect(`${this.configService.get("clientUrl")}/auth/success?accessToken=${accessToken}`);
  }

}
