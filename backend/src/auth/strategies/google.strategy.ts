// src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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
    const { id, displayName, emails, gender, phoneNumbers, name, photos } = profile;

    const email = emails?.[0]?.value || null;
    const phoneNumber = phoneNumbers?.[0]?.value || ''; // Assuming `phoneNumbers` field is available
    
    //checks if user exists
    let user = await this.userService.findByEmail(email);

    //create new user if google user doesn't exist
    if (!user) {
      const validGender = gender === 'male' || gender === 'female' ? gender : null;
      
      user = await this.userService.create({
        email,
        fullName: displayName,
        gender: validGender,
        username: email,
        password: '',
        phoneNumber,
        profilePicture: photos & photos[0] ? photos[0] : '',
      });

    }

    done(null, user);
  }
}
