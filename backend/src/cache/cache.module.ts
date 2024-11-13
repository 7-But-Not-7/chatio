import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheStore, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheEnum } from 'src/common/enums/cache.enum';

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
        ttl: CacheEnum.DEFAULT_CACHE_EXPIRATION,
      }),

      inject: [ConfigService],
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
