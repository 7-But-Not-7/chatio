import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheStore, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        store: await redisStore({
          url: configService.get('redis.cacheUrl')
        }) as unknown as CacheStore,
        ttl: 60 * 60, // 1 hour
      }),

      inject: [ConfigService],
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
