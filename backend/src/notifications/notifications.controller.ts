import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { NotificationEndpoints } from 'src/common/enums/endpoints.enum';
import { AuthInfo } from 'src/common/decorators/auth-info.decorator';
import { AccessTokenPayload } from 'src/common/types/auth';
import { NotificationOwnerGaurd } from './guards/notification-owner.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SuccessMessages } from 'src/common/enums/success-messages.enum';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
    ) { }

    // Get All User's Notifications
    @Get(NotificationEndpoints.GET_NOTIFICATIONS)
    @HttpCode(HttpStatus.OK)
    async getNotifications(@AuthInfo() authInfo: AccessTokenPayload) {
        const notifications = await this.notificationService.getNotifications(authInfo.userId);
        return new ResponseDto(SuccessMessages.NOTIFICATIONS_FETCHED, notifications);
    }

    // Get Notification By Id
    @Get(NotificationEndpoints.GET_NOTIFICATION)
    @UseGuards(NotificationOwnerGaurd)
    @HttpCode(HttpStatus.OK)
    async getNotification(@Param('notificationId') notificationId: string) {
        const notification = await this.notificationService.getNotification(notificationId);
        return new ResponseDto(SuccessMessages.NOTIFICATION_FETCHED, notification);
    }

    // Mark Notification As Read
    @Patch(NotificationEndpoints.MARK_AS_READ)
    @UseGuards(NotificationOwnerGaurd)
    @HttpCode(HttpStatus.NO_CONTENT)
    async markNotificationAsRead(@Param('notificationId') notificationId: string) {
        await this.notificationService.markNotificationAsRead(notificationId);
        return new ResponseDto(SuccessMessages.NOTIFICATION_MARKED_AS_READ);
    }

    // Mark All Notifications As Read
    @Patch(NotificationEndpoints.MARK_ALL_AS_READ)
    @HttpCode(HttpStatus.NO_CONTENT)
    async markAllNotificationsAsRead(@AuthInfo() authInfo: AccessTokenPayload) {
        await this.notificationService.markAllNotificationsAsRead(authInfo.userId);
        return new ResponseDto(SuccessMessages.ALL_NOTIFICATIONS_MARKED_AS_READ);
    }

    // Delete Notification
    @Delete(NotificationEndpoints.DELETE_NOTIFICATION)
    @UseGuards(NotificationOwnerGaurd)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNotification(@Param('notificationId') notificationId: string) {
        await this.notificationService.deleteNotification(notificationId);
        return new ResponseDto(SuccessMessages.NOTIFICATION_DELETED);
    }

    // Delete All User's Notifications
    @Delete(NotificationEndpoints.DELETE_ALL_NOTIFICATIONS)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllUserNotifications(@AuthInfo() authInfo: AccessTokenPayload) {
        await this.notificationService.deleteAllUserNotifications(authInfo.userId);
        return new ResponseDto(SuccessMessages.ALL_NOTIFICATIONS_DELETED);
    }
}
