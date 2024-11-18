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

@Controller('social-auth')
export class SocialAuthController {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
) {}



@Get('google')
async googleAuth(@Query('deviceId') deviceId: string, @Query('deviceName') deviceName: string,  @Res() res: Response ) {
  try {
    // Validate presence of `deviceId` and `deviceName`
    if (!deviceId || !deviceName) {
      throw new BadRequestException('Device ID and Device Name are required');
    }
   
     // Store device info in session or cookie
     res.cookie('deviceInfo', JSON.stringify({ deviceId, deviceName }), {
      httpOnly: true,
      secure: this.configService.get('isProduction'),
      sameSite: 'lax',
    });



    const googleAuthUrl = (`https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get<string>('auth.googleClientId')}&redirect_uri=${this.configService.get<string>('auth.backendUrl')}social-auth/google/callback&response_type=code&scope=email profile&state=some-random-state`);
    
    //redirects to google oauth for authentication
    return res.redirect(googleAuthUrl);
    

  } catch (error) {
    // Handle known errors or rethrow unexpected errors
    if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to initiate Google authentication');
  }
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
@HttpCode(200)
async googleAuthCallback(
  @Req() req: Request & { user: { id: string } },
  @Res() res: Response,
) {
    const deviceInfo = req.cookies.deviceInfo; // Access the 'deviceInfo' cookie
    try {
        if (!deviceInfo) {
        throw new BadRequestException('Device info is missing');
        }

        const { deviceId, deviceName } = JSON.parse(deviceInfo);
        // Validate parsed values
        if (!deviceId || !deviceName) {
        throw new BadRequestException('Device ID or Device Name is missing in state');
        }

        // Ensure user information is available from Google auth guard
        if (!req.user || !req.user.id) {
        throw new UnauthorizedException('User information not found');
        }

        // Generate tokens
        const deviceData = { name: deviceName }; // Use device name to create DeviceDto
        const token = await this.authService.generateAccessNRefreshTkn(req.user.id, deviceId, deviceData);

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
        throw new InternalServerErrorException('Failed to complete Google authentication');
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
