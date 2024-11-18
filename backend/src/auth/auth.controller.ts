import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { SessionService } from '../session/session.service'; 
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly sessionService: SessionService) {}


  @Post('login')
  async login(
    @Body('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!userId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User ID is required' });
    }

    const token = await this.sessionService.generateToken(userId);
    return res.status(HttpStatus.OK).json({ message: 'Login successful', token });
  }

  @Post('logout')
  async logout(
    @Body('token') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!token) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Token is required' });
    }

    await this.sessionService.deleteSession(token);
    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }

  @Post('logoutAll')
  async logoutAll(
    @Body('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!userId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User ID is required' });
    }

    await this.sessionService.deleteAllSessions(userId);
    return res.status(HttpStatus.OK).json({ message: 'All sessions invalidated' });
  }

  @Post('sessions')
  async getSessions(
    @Body('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!userId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User ID is required' });
    }

    const sessions = await this.sessionService.getSessionDetails(userId);
    return res.status(HttpStatus.OK).json({ sessions });
  }
}

