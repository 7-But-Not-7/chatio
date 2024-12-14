import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CacheModule } from 'src/cache/cache.module';
import { UserProvider } from './providers/user.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserProvider],
  imports: [TypeOrmModule.forFeature([User]), CacheModule],
  exports: [UserProvider],
})
export class UserModule {}
