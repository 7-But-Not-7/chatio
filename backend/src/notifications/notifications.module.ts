import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
