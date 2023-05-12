/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import Joi from 'joi';

export type Environment =
  | 'local'
  | 'development'
  | 'test'
  | 'staging'
  | 'production';

export const appSchema = {
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'test', 'staging', 'production')
    .default('development'),
  APP_NAME: Joi.string().default('NestJS App'),
  APP_PORT: Joi.number().default(5000),
  SERVICE_NAME: Joi.string().default('wage_service'),
  DATABASE_URL: Joi.string(),
  SCHEMA_NAME: Joi.string().default('public'),
};

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  serviceName: process.env.SERVICE_NAME,
  databaseUrl: process.env.DATABASE_URL,
  schemaName: process.env.SCHEMA_NAME,
  apiUrl: process.env.API_URL,
}));

@Injectable()
export class AppConfig {
  public readonly name: string;
  public readonly port: number;
  public readonly env: Environment;
  public readonly serviceName: string;
  public readonly databaseUrl: string;
  public readonly schemaName: string;
  public readonly apiUrl: string;

  public get isLocal(): boolean {
    return this.env === 'local';
  }

  public get isProduction(): boolean {
    return this.env === 'production';
  }

  constructor(
    @Inject(appConfig.KEY)
    config: ConfigType<typeof appConfig>,
  ) {
    this.name = config.name!;
    this.port = Number(config.port);
    this.env = config.env as Environment;
    this.serviceName = config.serviceName!;
    this.databaseUrl = config.databaseUrl!;
    this.schemaName = config.schemaName!;
    this.apiUrl = config.apiUrl!;
  }
}
