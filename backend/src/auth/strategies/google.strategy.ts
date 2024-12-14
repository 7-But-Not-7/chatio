import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { StrategyAuthHelper } from '../utils/strategy.auth.utils';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('oauth.googleClientId'),
      clientSecret: configService.get<string>('oauth.googleClientSecret'),
      callbackURL: `${configService.get<string>("apiUrl")}/auth/google/callback`,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.gender.read',
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void> {
    const user = StrategyAuthHelper.getGoogleProfile(profile);
    done(null, user);
  }
}
