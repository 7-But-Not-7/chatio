import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import developmentConfig from './environment/development';
import productionConfig from './environment/production';
import testConfig from './environment/test';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                redisConfig,
                process.env.NODE_ENV === 'production'
                    ? productionConfig
                    : process.env.NODE_ENV === 'test'
                        ? testConfig
                        : developmentConfig,
            ],
        }),
    ],
})
export class ConfigModule { }
