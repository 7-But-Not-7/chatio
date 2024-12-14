// src/auth/strategies/apple.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.appleClientId'),
      teamID: configService.get<string>('auth.appleTeamId'),
      keyID: configService.get<string>('auth.appleKeyId'),
      privateKey: configService.get<string>('auth.applePrivateKey'),
      callbackURL: 'http://localhost:3000/auth/apple/callback',
      scope: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
      appleId: profile.id,
      email: profile.email,
      name: profile.name,
    };
    done(null, user);
  }
}
