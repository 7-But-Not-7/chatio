import { Inject, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import Redis from 'ioredis';
import {Socket, Server} from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.auth.guard';
import { WsAuthMiddleware } from 'src/auth/guards/ws.middleware';
import { ChatListenEvents } from 'src/common/enums/ws-events.enum';
import { AuthenticatedWsClient } from 'src/common/types/auth';
import { ClientChatEvents, ServerChatEvents } from 'src/common/types/ws-events';

@UseGuards(WsAuthGuard)
@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    @Inject("WS_REDIS_CLIENT") private readonly wsRedisClient: Redis,
  ) {}

  @WebSocketServer() private readonly server: Server <ClientChatEvents, ServerChatEvents> 

  private getRedisKey(userId: string, deviceId: string) {
    return `chat:${userId}:${deviceId}`;
  }


  afterInit(server: Socket) {
    server.use(this.wsAuthMiddleware.authorize() as any);
  }

  handleConnection(client: AuthenticatedWsClient, ...args: any[]) {
    const {userId, deviceId} = client.authInfo;
    const redisKey = this.getRedisKey(userId, deviceId);
    this.wsRedisClient.set(redisKey, client.id);
  }

  handleDisconnect(client: AuthenticatedWsClient) {
    const {userId, deviceId} = client.authInfo;
    const redisKey = this.getRedisKey(userId, deviceId);
    this.wsRedisClient.del(redisKey);
  }

  @SubscribeMessage(ChatListenEvents.MESSAGE)
  handleMessage(client: AuthenticatedWsClient, payload: any) {
    client.broadcast.emit('', payload);
  }


}
