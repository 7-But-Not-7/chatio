const { DataSource } = require("typeorm");
require("dotenv").config();

module.exports = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.{ts,js}"],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  logging: process.env.IS_PRODUCTION === "true" ? false : ["error", "info", "log", "warn"],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  }

});
