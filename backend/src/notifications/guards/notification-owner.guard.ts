
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/types/auth';
import { NotificationsProvider } from '../providers/notifications.provider';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

@Injectable()
export class NotificationOwnerGaurd implements CanActivate {
  constructor(private readonly notificationsProvider: NotificationsProvider) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const { notificationId } = request.params;
    const { userId } = request.authInfo;
    if (!notificationId) {
      return false;
    }
    // Check if the user is the owner of the notification
    const notification = await this.notificationsProvider.getNotificationOwner(notificationId);
    if (notification.user.id !== userId) {
      throw new UnauthorizedException(ErrorMessages.NOT_NOTIFICATION_OWNER);
    }
    return true;
  }
}
