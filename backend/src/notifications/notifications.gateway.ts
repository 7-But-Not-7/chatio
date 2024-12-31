import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.auth.guard';
import { WsAuthMiddleware } from 'src/auth/guards/ws.middleware';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'notifications' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly wsAuthMiddleware: WsAuthMiddleware) {}

  @WebSocketServer() server: Server  

  afterInit(server: Socket) {
    server.use(this.wsAuthMiddleware.authorize() as any);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected to Notifications', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected from Notifications', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world! from Notifications';
  }
}
