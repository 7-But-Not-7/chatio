import { CreateNotificationDto } from "src/notifications/dto/create-notification.dto";
import { OmitType } from '@nestjs/mapped-types';

export interface NotificationJob {
    to: string;
    data: OmitType<CreateNotificationDto, ['userId']>;
}