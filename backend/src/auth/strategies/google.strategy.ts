import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ProfileHelper } from "src/common/utils/google-profile.helper"
import { SocialAuthService } from '../social-auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly socialAuthService: SocialAuthService,
  ) {
    super({
      clientID: configService.get<string>('auth.googleClientId'),
      clientSecret: configService.get<string>('auth.googleClientSecret'),
      callbackURL: 'http://localhost:3000/api/v1/social-auth/google/callback',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read', // Scope for phone numbers
        'https://www.googleapis.com/auth/user.gender.read', // Scope for gender
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const payload = ProfileHelper.extractProfileFields(profile);
    const user = await this.socialAuthService.validateUser(payload);

    done(null, user);
  }
}
