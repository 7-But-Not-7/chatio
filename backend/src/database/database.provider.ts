// src/database/database.provider.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseProvider implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    if (this.connection.isInitialized) {
      console.log('Database connection established successfully');
    }
  }
}