import { CreateNotificationDto } from "src/notifications/dto/create-notification.dto";
import { OmitType } from '@nestjs/mapped-types';

export interface NotificationJob {
    to: string;
    data: OmitType<CreateNotificationDto, ['userId']>;
}

export interface EmailJob {
    to: string;
    subject: string;
    template: EmailName;
    data: {[key: string]: any};
}

export interface SmsJob {
    to: string;
    message: string;
    data?: {[key: string]: any};
}