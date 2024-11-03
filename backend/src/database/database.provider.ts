// src/database/database.provider.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseProvider implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      if (this.connection.isInitialized) {
        console.log('Database connection established successfully');
        console.log('Connection options:', this.connection.options);
      }
    } catch (error) {
      console.error('Error establishing database connection:', error);
      console.error('Connection options:', this.connection.options);
    }
  }
}