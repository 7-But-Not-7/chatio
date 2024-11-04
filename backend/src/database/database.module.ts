// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: ['dist/**/*.entity.{ts,js}'],
        autoLoadEntities: true,
        logging: configService.get<boolean>('isProduction') ? false : ["error", "info", "log", "warn"],
        synchronize: !configService.get<boolean>('isProduction') || true,
      }),
    }),
  ],
  providers: [DatabaseProvider],
})
export class DatabaseModule { }
