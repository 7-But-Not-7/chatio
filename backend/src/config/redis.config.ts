// config/redis.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  sessionUrl: process.env.REDIS_SESSION_URL || 'redis://localhost:6379/0',
  cacheUrl: process.env.REDIS_CACHE_URL || 'redis://localhost:6379/1',
}));
