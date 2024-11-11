import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { BcryptService } from './services/bcrypt.service';
import { CryptoService } from './services/crypto.service';
import { SessionModule } from 'src/session/session.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptService, CryptoService],
  imports: [
    UserModule,
    SessionModule,
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
