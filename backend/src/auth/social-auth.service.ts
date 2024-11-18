import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';
import { BcryptService } from './services/bcrypt.service';
import { CryptoService } from './services/crypto.service';
import { DeviceDto } from './dtos/device.data.dto';
import { AuthEnum } from 'src/common/enums/auth.enum';
@Injectable()
export class SocialAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
        private readonly cryptoService: CryptoService,
    ) { }

     /**
      * Will generate access and refresh token then create session for user
      */
     async generateTokensAndCreateSession(userId: string, deviceId: string, device:  DeviceDto) {
        const accessToken = this.jwtService.sign({ userId, deviceId }, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRATION });
        const _refreshToken = this.cryptoService.random();
        const jwtrefreshToken = this.jwtService.sign({ userId, deviceId, refreshToken: _refreshToken }, { expiresIn: AuthEnum.REFRESH_TOKEN_EXPIRATION });
        const refreshToken = this.cryptoService.encrypt(jwtrefreshToken);
        await this.sessionService.createSession(userId, deviceId, { userId, deviceId, refreshToken: _refreshToken, device: device });
        return {accessToken, refreshToken}
      }

}
