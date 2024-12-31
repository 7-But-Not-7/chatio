import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueueModule } from 'src/queue/queue.module';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { FirebaseHelper } from 'src/common/utils/firebase.helper';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

@Module({
  imports: [QueueModule, AuthModule],
  providers: [NotificationsService, NotificationsGateway,
    {
      inject: [ConfigService],
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        const serviceAccountorPath = FirebaseHelper.getServiceAccountKey(configService);
        if(!serviceAccountorPath) {
          throw new Error(ErrorMessages.FIREBASE_SERVICE_KEY_NOT_FOUND);
        }
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccountorPath),
        });
      }
    }
  ],
  exports: [NotificationsService],
})
export class NotificationsModule { }