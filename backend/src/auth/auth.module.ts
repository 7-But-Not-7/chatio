import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { BcryptService } from './services/bcrypt.service';
import { CryptoService } from './services/crypto.service';
import { SessionModule } from 'src/session/session.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsModule } from 'src/sms/sms.module';
import { EmailModule } from 'src/email/email.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SocialAuthController } from './social-auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController, SocialAuthController],
  providers: [AuthService, BcryptService, CryptoService, JwtStrategy, JwtAuthGuard, GoogleStrategy],
  imports: [
    UserModule,
    SessionModule,
    SmsModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        global: true,
      }),
    }),
  ],
})
export class AuthModule {}
