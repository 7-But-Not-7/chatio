import { CreateNotificationDto } from "src/notifications/dto/create-notification.dto";
import { Notification } from "src/notifications/entities/notification.entity";
export interface NotificationJob {
    to: string;
    data: Pick<Notification, "title" | "content" | "type" | "actionURL" | "image">;
}

export interface EmailJob {
    to: string;
    subject: string;
    template: EmailName;
    data: { [key: string]: any };
}

export interface SmsJob {
    to: string;
    message: string;
    data?: { [key: string]: any };
}