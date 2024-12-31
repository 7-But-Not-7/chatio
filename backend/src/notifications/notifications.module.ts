import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { FirebaseHelper } from 'src/common/utils/firebase.helper';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { NotificationsController } from './notifications.controller';
import { NotificationsProvider } from './providers/notifications.provider';
import { FcmTokensProvider } from './providers/fcm-tokens.provider';
import { CacheModule } from 'src/cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmToken } from './entities/fcm-tokens.entity';
import { Notification } from './entities/notification.entity';
import { NotificationOwnerGaurd } from './guards/notification-owner.guard';
import Redis from 'ioredis';

@Module({
  imports: [forwardRef(() => AuthModule), CacheModule,
  TypeOrmModule.forFeature([FcmToken, Notification]),
  ],
  providers: [NotificationsService, NotificationsGateway, NotificationsProvider, FcmTokensProvider, NotificationOwnerGaurd,
    {
      inject: [ConfigService],
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        const serviceAccountorPath = FirebaseHelper.getServiceAccountKey(configService);
        if (!serviceAccountorPath) {
          throw new Error(ErrorMessages.FIREBASE_SERVICE_KEY_NOT_FOUND);
        }
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccountorPath),
        });
      }
    },
    {
      inject: [ConfigService],
      provide: 'WS_REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get('redis.socketUrl');
        if (!redisUrl) {
          throw new Error('Redis URL is not configured');
        }
        return new Redis(redisUrl);
      }
    }
  ],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule { }