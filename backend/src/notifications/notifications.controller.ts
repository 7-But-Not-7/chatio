import { Controller, Get } from '@nestjs/common';
import { NotificationJob } from 'src/common/types/notification';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
    ) { }

    @Get()
    async getNotifications() {
        const notification: NotificationJob = {
            to: "user-id",
            data: {
                title: "Hello",
                content: "World",
                image: "https://example.com/image.png",
                actionURL: "https://example.com",
            }
        }
        await this.notificationService.sendNotification(notification);
        return "Notification sent";
    }
}
