import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SessionService } from 'src/session/session.service';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { AccessTokenPayload } from '..';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    }

    const token = authHeader.split(' ')[1];
    try {
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
      request.authInfo = { userId, deviceId };
      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMessages.AUTHGUARD_DEFAULT);
    }
  }
}
