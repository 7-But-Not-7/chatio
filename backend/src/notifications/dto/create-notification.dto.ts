import { PickType } from "@nestjs/mapped-types";
import { Notification } from "../entities/notification.entity";


export class CreateNotificationDto extends PickType(Notification, [
    "title",
    "content",
    "type",
    "actionURL",
    "image",
])
{
    userId: string;
}