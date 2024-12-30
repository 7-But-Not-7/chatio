import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.auth.guard';

@UseGuards(WsAuthGuard)
@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server  

  afterInit(server: Server) {
    console.log(server.sockets);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    console.log('Message received', payload);
    client.broadcast.emit('message', payload);
  }
}
