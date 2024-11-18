// src/auth/controllers/social-auth.controller.ts
import { Controller, Get, UseGuards, Req, Headers, Query, HttpCode, Res, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SuccessMessages } from 'src/common/enums/success-messages.enum';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './guards/auth.guard';
import { SocialAuthService } from './social-auth.service';
import { SessionService } from 'src/session/session.service';
import { DeviceDto } from './dtos/device.data.dto';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthUrlHelper } from 'src/common/utils/auth-url.helper';

@Controller('social-auth')
export class SocialAuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly socialAuthService: SocialAuthService,
    private readonly userService: UserService,
) {}



@Get('google')
async googleAuth(@Query('deviceInfo') deviceInfo: string,  @Res() res: Response ) {
  try {
    // Parse the deviceInfo JSON string
    const parsedDeviceInfo = JSON.parse(deviceInfo);
    // Transform the parsed object into a DeviceDto instance
    const device = plainToInstance(DeviceDto, parsedDeviceInfo);

    // Validate the transformed instance
    const validationErrors = validateSync(device);
    if (validationErrors.length > 0) {
      throw new BadRequestException(ErrorMessages.INVALID_DEVICE_DETAILS);
    }
    
    //Save Device Info to Redis
    await this.sessionService.saveDeviceInfo(device);

     // Instantiate the helper class
     const authUrlHelper = new AuthUrlHelper(
      this.configService.get<string>('auth.googleClientId'),
      `${this.configService.get<string>('auth.backendUrl')}social-auth/google/callback`,
    );

    // Generate the Google Auth URL
    const googleAuthUrl = authUrlHelper.generateGoogleAuthUrl(device.id);
    
    //redirects to google oauth for authentication
    return res.redirect(googleAuthUrl);
    

  } catch (error) {
    // Handle known errors or rethrow unexpected errors
    if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
      throw error;
    }
    throw new InternalServerErrorException(ErrorMessages.GOOGLE_AUTH);
  }
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
@HttpCode(200)
async googleAuthCallback(
  @Req() req: Request & { user: { id: string } },
  @Res() res: Response,
  @Query('state') deviceId: string,
) {
    try {
        if (!deviceId) {
          throw new BadRequestException(ErrorMessages.NO_DEVICE);
        }

        const deviceInfo = await this.sessionService.getDeviceInfo(deviceId);

        if(!deviceInfo) {
          throw new BadRequestException(ErrorMessages.NO_DEVICE);
        }
        // Ensure user information is available from Google auth guard
        if (!req.user || !req.user.id) {
        throw new UnauthorizedException(ErrorMessages.NO_USER);
        }

        // Generate tokens
        const token = await this.socialAuthService.generateTokensAndCreateSession(req.user.id, deviceId, deviceInfo);

        // Set the refresh token in cookies
        res.cookie('refreshToken', token.refreshToken, {
          httpOnly: true,
          secure: this.configService.get('isProduction'),
          sameSite: 'lax',
        });

        // Send success response
        return res.send(new ResponseDto(SuccessMessages.LOGIN_SUCCESSFUL, { accessToken: token.accessToken }));
    } catch (error) {
        if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error; // Re-throw known errors for proper HTTP status response
        }

        // Handle unexpected errors
        throw new InternalServerErrorException(ErrorMessages.GOOGLE_AUTH);
    }
  }


  // @Get('apple')
  // @UseGuards(AuthGuard('apple'))
  // async appleAuth() {
  //   // initiates Apple login
  // }

  // @Get('apple/callback')
  // @UseGuards(AuthGuard('apple'))
  // async appleAuthCallback(@Req() req: Request) {
  //   const jwt = (req.user);
  //   return new ResponseDto(SuccessMessages.LOGIN_SUCCESSFUL, { accessToken: jwt });
  // }

@Get('test-jwt')
@UseGuards(JwtAuthGuard)  // Applied JWT guard to protect this route
async testJwt(@Req() req: Request & {user : {userId: string}}, @Res() res: Response) {
  const userId= req.user.userId;
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
