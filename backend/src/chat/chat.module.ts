import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { ChatMember } from './entities/chat-member.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { File } from './entities/file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ChatInvitation } from './entities/chat-invitation.entity';
import { ChatMemeberProvider } from './providers/chat-member.provider';
import { ChatInvitationProvider } from './providers/chat-invitation.provider';
import { MessageProvider } from './providers/message.provider';
import { ChatRoomProvider } from './providers/chat-room.provider';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  controllers: [],
  providers: [ChatGateway, ChatRoomProvider, ChatInvitationProvider, MessageProvider, ChatMemeberProvider,
    {
      inject: [ConfigService],
      provide: 'WS_REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get('redis.socketUrl');
        if (!redisUrl) {
          throw new Error('Redis URL is not configured');
        }
        return new Redis(redisUrl);
      }
    }
  ],
  imports: [
    TypeOrmModule.forFeature([Message, ChatMember, ChatRoom, File, ChatInvitation]),
    AuthModule,
    QueueModule,
  ],
})
export class ChatModule { }
