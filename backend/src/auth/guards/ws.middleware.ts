import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGaurdBase } from "src/auth/guards";
import { ErrorMessages } from "src/common/enums/error-messages.enum";
import { WsAuthMiddlewareType } from "src/common/types/middleware";
import { Socket } from "socket.io";

@Injectable()
export class WsAuthMiddleware implements WsAuthMiddlewareType{
    constructor(private readonly authGaurdBase: AuthGaurdBase) { }

    authorize = () => async (client: Socket, next: (err?: Error) => void) => {
        const token = client.handshake.auth.token || client.handshake.headers.authorization;
        console.log('Token:', token);
        try {
            const authInfo = await this.authGaurdBase.validateToken(token);
            console.log('AuthInfo:', authInfo);
            (client as any).authInfo = authInfo;
            next();
        } catch (e) {
            next(e instanceof HttpException? e : new UnauthorizedException(ErrorMessages.AUTHGUARD_DEFAULT));
        }
    }
}