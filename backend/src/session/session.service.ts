import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class SessionService {
  constructor(@Inject('REDIS_SESSION') private readonly redisSession: RedisClientType) { }

  private generateKey(userId: string, deviceId: string) {
    return `session:${userId}:${deviceId}`;
  }

  async createSession(userId: string, deviceId: string, value: {[key: string]: any}, ttl: number = 3600) {
    const key = this.generateKey(userId, deviceId);
    await this.redisSession.set(key, JSON.stringify(value), { EX: ttl });
  }

  async getSession(userId: string, deviceId: string) {
    const key = this.generateKey(userId, deviceId);
    const data = await this.redisSession.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(userId: string, deviceId: string) {
    const key = this.generateKey(userId, deviceId);
    await this.redisSession.del(key);
  }

  async deleteAllSessions(userId: string) {
    const keys = await this.redisSession.keys(`session:${userId}:*`);
    keys.forEach(async (key) => {
      await this.redisSession.del(key);
    });
  }
}
