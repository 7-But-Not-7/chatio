import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';
import { CryptoService } from './crypto.service';
import { DeviceDto } from '../dtos/device.data.dto';
import { AuthEnum } from 'src/common/enums/auth.enum';
import { ProfileData } from "src/common/utils/google-profile.helper"
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class SocialAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) { }


  /**
   * Checks if the user exists and create a new one if the user does not exis
   * @param payload 
   * @returns User
   */
  async validateUser(payload: ProfileData): Promise<User> {
    try {
      let user = await this.userService.findByEmail(payload.email);

      if (!user) {
        user = await this.userService.create({
          email: payload.email,
          fullName: payload.displayName,
          gender: payload.gender,
          username: payload.email,
          password: '',
          phoneNumber: payload.phoneNumber,
          profilePicture: payload.profilePicture,
        });
      }

      return user;
    } catch (error) {
      // Throw an Internal Server Error
      throw new InternalServerErrorException(ErrorMessages.USER_VALIDATION);
    }
  }


  /**
   * Will generate access and refresh token then create session for user
   */
  async generateTokensAndCreateSession(userId: string, deviceId: string, device: DeviceDto) {
    const accessToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRATION });
    const _refreshToken = this.cryptoService.random();
    const jwtrefreshToken = this.jwtService.sign({ userId, deviceId, refreshToken: _refreshToken }, { expiresIn: AuthEnum.REFRESH_TOKEN_EXPIRATION });
    const refreshToken = this.cryptoService.encrypt(jwtrefreshToken);
    await this.sessionService.createSession(userId, deviceId, { userId, deviceId, refreshToken: _refreshToken, device: device });
    return { accessToken, refreshToken }
  }

}
