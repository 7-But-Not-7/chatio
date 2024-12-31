import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './processors/email.processor';
import { SmsProcessor } from './processors/sms.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SmsModule } from 'src/sms/sms.module';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [
        NotificationsModule,
        SmsModule,
        EmailModule,
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService) => ({
                redis: {
                    host: configService.get('redis.host'),
                    port: configService.get('redis.port'),
                },
                defaultJobOptions: {
                    attempts: 5,
                    backoff: {
                        type: "fixed",
                        delay: 5000,
                    },
                    removeOnComplete: true,
                    removeOnFail: true,
                }
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue(
            { name: 'email'},
            { name: 'sms'},
            { name: 'notification'}
        ),
    ],
    providers: [EmailProcessor, SmsProcessor, NotificationProcessor],
    exports: [BullModule],
})
export class QueueModule {}
