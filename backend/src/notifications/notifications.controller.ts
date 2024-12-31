import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { NotificationEndpoints } from 'src/common/enums/endpoints.enum';
import { AuthInfo } from 'src/common/decorators/auth-info.decorator';
import { AccessTokenPayload } from 'src/common/types/auth';
import { NotificationOwnerGaurd } from './guards/notification-owner.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
    ) { }

    // Get All User's Notifications
    @Get(NotificationEndpoints.GET_NOTIFICATIONS)
    async getNotifications(@AuthInfo() authInfo: AccessTokenPayload) {

    }

    // Get Notification By Id
    @Get(NotificationEndpoints.GET_NOTIFICATION)
    @UseGuards(NotificationOwnerGaurd)
    async getNotification(@Param('notificationId') notificationId: string) {

    }

    // Mark Notification As Read
    @Get(NotificationEndpoints.MARK_AS_READ)
    @UseGuards(NotificationOwnerGaurd)
    async markNotificationAsRead(@Param('notificationId') notificationId: string) {

    }

    // Mark All Notifications As Read
    @Get(NotificationEndpoints.MARK_ALL_AS_READ)
    async markAllNotificationsAsRead(@AuthInfo() authInfo: AccessTokenPayload) {

    }

    // Delete Notification
    @Get(NotificationEndpoints.DELETE_NOTIFICATION)
    @UseGuards(NotificationOwnerGaurd)
    async deleteNotification(@Param('notificationId') notificationId: string) {

    }

    // Delete All User's Notifications
    @Get(NotificationEndpoints.DELETE_ALL_NOTIFICATIONS)
    async deleteAllUserNotifications(@AuthInfo() authInfo: AccessTokenPayload) {

    }
}
