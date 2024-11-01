import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { CallModule } from './call/call.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, ChatModule, CallModule, NotificationsModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
