import { Inject, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.auth.guard';
import { WsAuthMiddleware } from 'src/auth/guards/ws.middleware';
import { WsAuthInfo } from 'src/common/decorators/auth-info.ws.decorator';
import { AccessTokenPayload } from 'src/common/types/auth';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    @Inject("WS_REDIS_CLIENT") private readonly wsRedisClient: Redis,
  ) { }

  @WebSocketServer() server: Server

  afterInit(server: Socket) {
    server.use(this.wsAuthMiddleware.authorize() as any);
  }

  handleConnection(client: Socket, @WsAuthInfo() authInfo: AccessTokenPayload, ...args: any[]) {
    console.log('Client connected to Notifications', client.id);
  }

  handleDisconnect(@WsAuthInfo() authInfo: AccessTokenPayload) {
    console.log('Client disconnected from Notifications', authInfo.userId);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world! from Notifications';
  }
}
