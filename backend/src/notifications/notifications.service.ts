import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class NotificationsService {
    constructor(@InjectQueue("notification") private readonly notificationQueue : Queue) {}

    async sendNotification(to: string, message: string){
        await this.notificationQueue.add({ to, message });
    }
}
