import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/session/session.service';
import { CryptoService } from '../providers/crypto.service';
import { DeviceDto } from '../dtos/device.data.dto';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { GoogleProfile } from '../../common/types/auth';
import { User } from 'src/user/entities/user.entity';
import { RandomHelper } from 'src/common/utils/random.helper';
import { AuthEnum } from 'src/common/enums/auth.enum';
import { UserProvider } from 'src/user/providers/user.provider';


@Injectable()
export class SocialAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly userProvider: UserProvider,
    private readonly cryptoService: CryptoService,
  ) { }


  private async createUser(profile: GoogleProfile): Promise<User> {
    // Check if user with email, username or phone number already exists
    const userWithEmail = await this.userProvider.findByEmail(profile.email);
    if (userWithEmail) {
      throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    if (profile.phoneNumber) {
      const userWithPhoneNumber = await this.userProvider.findByPhoneNumber(profile.phoneNumber);
      if (userWithPhoneNumber) {
        throw new BadRequestException(ErrorMessages.PHONE_NUMBER_ALREADY_EXISTS);
      }
    }

    const userWithUsername = await this.userProvider.findByUsername(profile.displayName);
    if (userWithUsername) {
      const randomString = RandomHelper.generateRandomString(5);
      const randomNumber = RandomHelper.generateRandomNumber(3);
      profile.displayName = `${profile.displayName.split(" ")[0]}${randomString}${randomNumber}`;
    }

    // Create user
    const newUser = await this.userProvider.createGoogleUser({
      email: profile.email,
      username: profile.displayName,
      phoneNumber: profile.phoneNumber,
      fullName: profile.name?.givenName + ' ' + profile.name?.familyName,
    }, profile.id);

    return newUser;
  }

  async saveDeviceInfo(device: DeviceDto) {
    try {
      await this.sessionService.saveDeviceInfo(device);
    } catch (error) {
      throw new InternalServerErrorException(ErrorMessages.SAVING_DEVICE_INFO_FAILDED);
    }
  }


  async createOrLogin(profile: GoogleProfile, deviceId: string) {
    const user = await this.userProvider.findByGoogleId(profile.id) || await this.createUser(profile);
    const device = await this.sessionService.getDeviceInfo(deviceId);

    if (!device) {
      throw new BadRequestException(ErrorMessages.DEVICE_NOT_FOUND);
    }

    // Get access and refresh tokens
    const accessToken = this.jwtService.sign({ userId: user.id, deviceId }, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRATION });
    const _refreshToken = this.cryptoService.random();
    const jwtrefreshToken = this.jwtService.sign({ userId: user.id, deviceId, refreshToken: _refreshToken }, { expiresIn: AuthEnum.REFRESH_TOKEN_EXPIRATION });
    const refreshToken = this.cryptoService.encrypt(jwtrefreshToken);
    await this.sessionService.createSession(user.id, deviceId, { userId: user.id, deviceId, refreshToken: _refreshToken, device });
    return { accessToken, refreshToken };

  }

}
