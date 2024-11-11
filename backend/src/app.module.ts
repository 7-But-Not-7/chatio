import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { CallModule } from './call/call.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    ChatModule,
    CallModule,
    NotificationsModule,
    ConfigModule,
    DatabaseModule,
    CacheModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
