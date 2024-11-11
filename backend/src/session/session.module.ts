import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Module({
  imports: [ConfigModule],
  providers: [
    SessionService,
    {
      provide: "REDIS_SESSION",
      useFactory: async (configService) => {
        const client = createClient({
          url: configService.get("redis.sessionUrl")
        });
        client.on('error', (err) => console.error('Redis Session Error:', err));
        await client.connect();
        console.log('Connected to Redis for Session Storage');
        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports: [SessionService]
})
export class SessionModule { }
