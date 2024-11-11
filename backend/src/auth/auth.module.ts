import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { BcrytpService } from './services/bcrypt.service';
import { CryptoService } from './services/crypto.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcrytpService, CryptoService],
  imports: []
})
export class AuthModule {}
