import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [TypeOrmModule.forFeature([Message])],
})
export class ChatModule { }
