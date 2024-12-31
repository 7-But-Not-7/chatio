import { Inject, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket, Server } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.auth.guard';
import { WsAuthMiddleware } from 'src/auth/guards/ws.middleware';
import { AuthenticatedWsClient } from 'src/common/types/auth';
import { NotificationJob } from 'src/common/types/notification';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    @Inject("WS_REDIS_CLIENT") private readonly wsRedisClient: Redis,
  ) { }

  @WebSocketServer() server: Server

  private getRedisKey(userId: string, deviceId: string) {
    return `notifications:${userId}:${deviceId}`;
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

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedWsClient, payload: any): void {
    this.server.emit('message', `${client.authInfo.userId} says ${payload}`);   
  }

  async sendNotification({to, data}: NotificationJob) {
    const keys = await this.wsRedisClient.keys(`notifications:${to}:*`);
    keys.forEach(async (key) => {
      const socketId = await this.wsRedisClient.get(key);
      this.server.to(socketId).emit('notification', data);
    });
  }
}
