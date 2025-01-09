import { Inject, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.auth.guard';
import { WsAuthMiddleware } from 'src/auth/guards/ws.middleware';
import { ChatEmitEvents, ChatListenEvents } from 'src/common/enums/ws-events.enum';
import { AuthenticatedWsClient } from 'src/common/types/auth';
import { ClientChatEvents, ServerChatEvents } from 'src/common/types/ws-events';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    @Inject("WS_REDIS_CLIENT") private readonly wsRedisClient: Redis,
  ) { }

  @WebSocketServer() private readonly server: Server<ClientChatEvents, ServerChatEvents>

  private getRedisKey(userId: string, deviceId: string) {
    return `chat:${userId}:${deviceId}`;
  }


  afterInit(server: Socket) {
    server.use(this.wsAuthMiddleware.authorize() as any);
  }

  handleConnection(client: AuthenticatedWsClient, ...args: any[]) {
    // Save the socket id to redis
    const { userId, deviceId } = client.authInfo;
    const redisKey = this.getRedisKey(userId, deviceId);
    this.wsRedisClient.set(redisKey, client.id);
  }

  handleDisconnect(client: AuthenticatedWsClient) {
    const { userId, deviceId } = client.authInfo;
    const redisKey = this.getRedisKey(userId, deviceId);
    this.wsRedisClient.del(redisKey);
  }

  async sendMessage(userId: string, message: CreateMessageDto) {
    // Send to all members of the chat room except the sender
    const redisKeys = await this.wsRedisClient.keys(`chat:${userId}:*`);
    const socketIdsMap = redisKeys.map(async (key) => {
      const socketId = await this.wsRedisClient.get(key);
      return socketId;
    });
    const socketIds = await Promise.all(socketIdsMap);
    this.server.to(message.chatRoomId).except(socketIds).emit(ChatEmitEvents.MESSAGE, message);
  }

  async updateMessage(userId: string, chatRoomId: string, message: Message) {
    // Send to all members of the chat room except the sender
    const redisKeys = await this.wsRedisClient.keys(`chat:${userId}:*`);
    const socketIdsMap = redisKeys.map(async (key) => {
      const socketId = await this.wsRedisClient.get(key);
      return socketId;
    });
    const socketIds = await Promise.all(socketIdsMap);
    this.server.to(chatRoomId).except(socketIds).emit(ChatEmitEvents.UPDATE_MESSAGE, message);
  }

  async deleteMessage(userId: string, chatRoomId: string, messageId: string) {
    // Send to all members of the chat room except the sender
    const redisKeys = await this.wsRedisClient.keys(`chat:${userId}:*`);
    const socketIdsMap = redisKeys.map(async (key) => {
      const socketId = await this.wsRedisClient.get(key);
      return socketId;
    });
    const socketIds = await Promise.all(socketIdsMap);
    this.server.to(chatRoomId).except(socketIds).emit(ChatEmitEvents.DELETE_MESSAGE, { messageId });
  }

  @SubscribeMessage(ChatListenEvents.MESSAGE)
  handleMessage(client: AuthenticatedWsClient, payload: any) {
    client.broadcast.emit('', payload);
  }


}
