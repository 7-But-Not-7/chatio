import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { NotificationsService } from "src/notifications/notifications.service";


@Processor('notification')
export class NotificationProcessor {
    constructor(private readonly notificationService: NotificationsService) { }

    @Process()
    async sendNotification(job: Job) {
        console.log("Sending notification", job.data);
        await this.notificationService.sendNotification(job.data);
    }
}