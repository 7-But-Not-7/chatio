import { Global, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ErrorMessages } from "src/common/enums/error-messages.enum";
import { AccessTokenPayload } from "src/common/types/auth";
import { SessionService } from "src/session/session.service";

@Injectable()
export class AuthGaurdBase{
    constructor(
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
      ) { }

      async validateToken(authHeader: string): Promise<AccessTokenPayload> {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
        }
    
        const token = authHeader.split(' ')[1];
        const { userId, deviceId } = this.jwtService.verify<AccessTokenPayload>(token);
    
        // Gets and validate the session for the user and device
        const session = await this.sessionService.getSession(userId, deviceId);
        const isSessionValid = session.deviceId === deviceId;
        if (!session || !isSessionValid) {
          throw new UnauthorizedException(ErrorMessages.INVALID_SESSION);
        }
    
        //Extend user session
        await this.sessionService.updateSessionExpiration(userId, deviceId);
    
        // Attach user info to the request object
        return { userId, deviceId };
      }
}