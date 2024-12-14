import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { DeviceDto } from 'src/auth/dtos/device.data.dto';
import { AuthEnum } from 'src/common/enums/auth.enum';
import { SessionData } from '.';

@Injectable()
export class SessionService {
  constructor(@Inject('REDIS_SESSION') private readonly redisSession: RedisClientType) { }

  private generateKey(userId: string, deviceId: string) {
    return `session:${userId}:${deviceId}`;
  }

  private generateDeviceKey(deviceId: string): string {
    return `device:${deviceId}`;
  }

  async createSession(userId: string, deviceId: string, value: SessionData, ttl: number = AuthEnum.SESSION_DEFAULT_EXPIRATION) {
    const key = this.generateKey(userId, deviceId);
    await this.redisSession.set(key, JSON.stringify(value), { EX: ttl });
  }

  // Set new expiration time for the session
  async updateSessionExpiration(userId: string, deviceId: string, ttl: number = AuthEnum.SESSION_DEFAULT_EXPIRATION) {
    const key = this.generateKey(userId, deviceId);
    await this.redisSession.expire(key, ttl);
  }

  async getSession(userId: string, deviceId: string): Promise<SessionData | null> {
    const key = this.generateKey(userId, deviceId);
    const data = await this.redisSession.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteSessionByDeviceId(deviceId: string) {
    const keys = await this.redisSession.keys(`session:*:${deviceId}`);
    keys.forEach(async (key) => {
      await this.redisSession.del(key);
    });
  }

  async deleteAllSessions(userId: string) {
    const keys = await this.redisSession.keys(`session:${userId}:*`);
    keys.forEach(async (key) => {
      await this.redisSession.del(key);
    });
  }

  // Verifications
  async setVerificationCode(key: string, code: string, ttl: number = AuthEnum.VERIFICATION_CODE_DEFAULT_EXPIRATION) {
    await this.redisSession.set(key, code, { EX: ttl });
  }

  async getVerificationCode(key: string) {
    return this.redisSession.get(key);
  }

  //check session validity
  async isSessionValid(userId: string, deviceId: string): Promise<boolean> {
    const session = await this.getSession(userId, deviceId);
    return !!session;
  }

  // Will store device details in Redis using device id as key
  async saveDeviceInfo(deviceInfo: DeviceDto, ttl: number = AuthEnum.DEVICE_EXPIRATION) {
    const key = this.generateDeviceKey(deviceInfo.id);
    await this.redisSession.set(key, JSON.stringify(deviceInfo), { EX: ttl });
  }

  // Will get device info from Redis
  async getDeviceInfo(deviceId: string) {
    const key = this.generateDeviceKey(deviceId);
    const data = await this.redisSession.get(key);
    return data ? JSON.parse(data) : null;
  }
}
