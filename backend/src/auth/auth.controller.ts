import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
// import { AuthController } from './auth.controller';
import { SessionService } from '../session/session.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('Xb0Dw3UgAZ'),
        signOptions: { expiresIn: '1h' }, // Token expiry
      }),
    }),
  ],
  // controllers: [AuthController],
  providers: [SessionService],
})
export class AuthModule {}
