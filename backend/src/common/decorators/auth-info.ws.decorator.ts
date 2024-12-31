
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedWsClient } from '../types/auth';

// Create a custom decorator to extract `authInfo` from the socket
export const WsAuthInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client: AuthenticatedWsClient = ctx.switchToWs().getClient(); 
    console.log({client})
    return client.authInfo;
  },
);
