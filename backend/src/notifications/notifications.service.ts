import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { NotificationsGateway } from './notifications.gateway';
import { FcmTokensProvider } from './providers/fcm-tokens.provider';
import { NotificationsProvider } from './providers/notifications.provider';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly notificationGateway: NotificationsGateway,
        private readonly notificationProvider:  NotificationsProvider,
        private readonly fcmTokensProvider: FcmTokensProvider,
        @InjectQueue("notification") private readonly notificationQueue : Queue,
    ) {}

    async sendNotification(to: string, message: string){
        await this.notificationQueue.add({ to, message });
    }
}
