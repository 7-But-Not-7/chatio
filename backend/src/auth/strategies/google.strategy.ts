import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthHelper } from 'src/common/utils/auth.helper';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('oauth.googleClientId'),
      clientSecret: configService.get<string>('oauth.googleClientSecret'),
      callbackURL: `${configService.get<string>("apiUrl")}/auth/google/callback`,
      passReqToCallback: true,
      state: true,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.gender.read',
      ],
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void> {
    const user = AuthHelper.getGoogleProfile(profile);
    done(null, user);
  }
}
