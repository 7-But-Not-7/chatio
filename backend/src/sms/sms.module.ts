import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
