import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { NotificationEndpoints } from 'src/common/enums/endpoints.enum';
import { AuthInfo } from 'src/common/decorators/auth-info.decorator';
import { AccessTokenPayload } from 'src/common/types/auth';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
    ) { }

    @Get(NotificationEndpoints.GET_NOTIFICATIONS)
    async getNotifications(@AuthInfo() authInfo: AccessTokenPayload) {
        return "Hello";
    }
}
