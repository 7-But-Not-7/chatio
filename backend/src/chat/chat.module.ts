import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { ChatMember } from './entities/chat-member.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { File } from './entities/file.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [
    TypeOrmModule.forFeature([Message, ChatMember, ChatRoom, File]),
    AuthModule
  ],
})
export class ChatModule { }
