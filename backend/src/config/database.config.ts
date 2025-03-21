// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5436,
  username: process.env.DB_USERNAME || "admin",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
}));
