import { Inject, Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { FcmTokensProvider } from './providers/fcm-tokens.provider';
import { NotificationsProvider } from './providers/notifications.provider';
import { NotificationJob } from 'src/common/types/notification';
import * as admin from 'firebase-admin';
import { TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly notificationGateway: NotificationsGateway,
        private readonly notificationProvider: NotificationsProvider,
        private readonly fcmTokensProvider: FcmTokensProvider,
        @Inject("FIREBASE_ADMIN") private readonly firebaseAdmin: admin.app.App,
    ) { }

    async sendNotification(notificationJob: NotificationJob) {
        try {
            await this.notificationProvider.createNotification({ ...(notificationJob.data), userId: notificationJob.to });
            const fcmTokens = await this.fcmTokensProvider.getUserTokens(notificationJob.to);
            const tokens = fcmTokens.map(token => token.token);
            // const tokens = [];
            const payload: Omit<TokenMessage, "token"> = {
                notification: {
                    title: notificationJob.data.title,
                    body: notificationJob.data.content,
                    imageUrl: notificationJob.data.image,
                },
                webpush: {
                    notification: {
                        icon: notificationJob.data.image,
                        click_action: notificationJob.data.actionURL,
                        vibrate: [200, 100, 200],
                    }
                },
            };
            for (const token of tokens) {
                await this.firebaseAdmin.messaging().send({ ...payload, token });
            }
        } catch (error) {
            console.error("Error sending notification", error)
        }
    }
}
