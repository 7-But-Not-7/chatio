import { Socket } from 'socket.io';

export interface WsAuthMiddlewareType {
    authorize: (client: Socket, next: (err?: Error) => void) => void;
}