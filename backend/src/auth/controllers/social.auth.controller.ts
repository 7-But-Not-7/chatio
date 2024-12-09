// src/auth/controllers/social-auth.controller.ts
import { Controller, Get, UseGuards, Req, Query, HttpCode, Res, BadRequestException, InternalServerErrorException, Redirect, HttpStatus, ParseIntPipe, ParseFloatPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SuccessMessages } from 'src/common/enums/success-messages.enum';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { SocialAuthService } from '../services/social.auth.service';
import { DeviceDto } from '../dtos/device.data.dto';
import { AuthEndpoints } from 'src/common/enums/endpoints.enum';
import { AppEnum } from 'src/common/enums/app.enum';
import { GoogleProfile } from '..';
import { ParseAndValidate } from 'src/common/pipes/parse-validate.pipe';

@Controller('auth')
export class SocialAuthController {
  constructor(
    private readonly socialAuthService: SocialAuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) { }

  @Get(AuthEndpoints.GOOGLE_AUTH)
  @Redirect()
  async googleAuth(@Query('device', new ParseAndValidate(DeviceDto)) device: string, @Res() res: Response) {
    //Save Device Info
    let deviceData = device as unknown as DeviceDto;
    console.log(deviceData)
    await this.socialAuthService.saveDeviceInfo(deviceData);

    return { url: `${AuthEndpoints.GOOGLE_REDIRECT}?state=${deviceData.id}`, statusCode: HttpStatus.FOUND };
  }

  @Get(AuthEndpoints.GOOGLE_REDIRECT)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect() { }

  @Get(AuthEndpoints.GOOGLE_AUTH_CALLBACK)
  @UseGuards(AuthGuard('google'))
  @HttpCode(200)
  async googleAuthCallback(
    @Query('state') deviceId: string,
    @Req() req: Request & { user: GoogleProfile },
    @Res() res: Response
  ) {
    console.log(req.query)
    const { accessToken, refreshToken } = await this.socialAuthService.createOrLogin(req.user, deviceId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get("isProduction"),
      sameSite: 'lax',
    });

    res.redirect(`${this.configService.get("clientUrl")}/auth/success?accessToken=${accessToken}`);
  }


  @Get('test-jwt')
  @UseGuards(JwtAuthGuard)  // Applied JWT guard to protect this route
  async testJwt(@Req() req: Request & { user: { userId: string } }, @Res() res: Response) {
    const userId = req.user.userId;
    try {
      const user = await this.userService.findById(userId);
      res.send(new ResponseDto(SuccessMessages.LOGIN_SUCCESSFUL, user));
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to Fetch user');
    }
  }

}
