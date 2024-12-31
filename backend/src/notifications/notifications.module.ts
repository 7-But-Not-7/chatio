import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueueModule } from 'src/queue/queue.module';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [QueueModule, AuthModule],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
