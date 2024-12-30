import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { AuthGaurdBase } from '.';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authGaurdBase: AuthGaurdBase,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    try {
      // Attach user info to the request object
      request.authInfo = await this.authGaurdBase.validateToken(authHeader);
      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMessages.AUTHGUARD_DEFAULT);
    }
  }
}
