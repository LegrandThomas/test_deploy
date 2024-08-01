// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'base_test',
  synchronize: true,
  logging: true,
  entities: ["./entity/**/*.ts"],
  migrations: ['./migration/**/*.ts'],
  subscribers: [],
});
