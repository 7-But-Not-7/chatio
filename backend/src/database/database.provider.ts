// src/database/database.provider.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseProvider implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.initialize();
      if (this.dataSource.isInitialized) {
        console.log('Database connection established successfully');
      }
    } catch (error) {
      console.error('Error establishing database connection:');
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    }
  }
}
