import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class SessionService {
    constructor(@Inject('REDIS_SESSION') private readonly redisSession: RedisClientType) {}

    async setSession(key: string, value: any, ttl: number = 3600) {
        await this.redisSession.set(key, JSON.stringify(value), { EX: ttl });
      }
    
      async getSession(key: string) {
        const data = await this.redisSession.get(key);
        return data ? JSON.parse(data) : null;
      }
    
      async deleteSession(key: string) {
        await this.redisSession.del(key);
      }
}
