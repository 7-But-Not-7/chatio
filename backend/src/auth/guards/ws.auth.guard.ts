import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthGaurdBase } from '.';

@Injectable()
export class WsAuthGuard implements CanActivate {

    constructor(private readonly authGaurdBase: AuthGaurdBase) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();
        const token = client.handshake.auth.token || client.handshake.headers.authorization;
        try {
            const authInfo = await this.authGaurdBase.validateToken(token);
            (client as any).authInfo = authInfo;
            return true;
        } catch (error) {
            // Disconnect the client
            client.disconnect(true);
            return false;
        }
    }
}
