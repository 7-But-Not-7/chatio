import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { Request } from 'express';
import { SessionService } from 'src/session/session.service';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly sessionService: SessionService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
      }
  
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
  
        const { userId, deviceId } = payload;
  
        // Gets and validate the session for the user and device
        const session = await this.sessionService.getSession(userId, deviceId);
        const isSessionValid = session.deviceId === deviceId;
        if (!session || !isSessionValid) {
          throw new UnauthorizedException(ErrorMessages.INVALID_SESSION);
        }
        //Extend user session
        await this.sessionService.updateSessionExpiration(userId, deviceId);
        // Attach user info to the request object
        request.user = { userId, deviceId };
        return true;
      } catch (error) {
        throw new UnauthorizedException(ErrorMessages.AUTHGUARD_DEFAULT);
      }
    }
  }
  