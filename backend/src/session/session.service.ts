import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  private readonly jwtSecret: string;

  constructor(
    @Inject('REDIS_SESSION') private readonly redisSession: RedisClientType,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, 
  ) {

    this.jwtSecret = this.configService.get<string>('Xb0Dw3UgAZ');
  }

  async generateToken(userId: string): Promise<string> {
    const payload = { userId };
    const token = this.jwtService.sign(payload, { secret: this.jwtSecret, expiresIn: '1h' });
    const key = `session:${userId}:${token}`;

    await this.setSession(key, { token }, 3600);
    return token;
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, { secret: this.jwtSecret });  
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async setSession(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redisSession.set(key, JSON.stringify(value), { EX: ttl });
  }

  async getSession(key: string): Promise<any> {
    const data = await this.redisSession.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(token: string): Promise<void> {
    const keys = await this.redisSession.keys(`session:*:${token}`);
    if (keys.length > 0) {
      await this.redisSession.del(keys[0]);
    }
  }

  async deleteAllSessions(userId: string): Promise<void> {
    const keys = await this.redisSession.keys(`session:${userId}:*`);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => this.redisSession.del(key)));
    }
  }

  async getSessionDetails(userId: string): Promise<any[]> {
    const keys = await this.redisSession.keys(`session:${userId}:*`);
    const sessions = await Promise.all(
      keys.map(async (key) => {
        const data = await this.redisSession.get(key);
        return data ? JSON.parse(data) : null;
      }),
    );
    return sessions.filter((session) => session !== null);
  }
}
