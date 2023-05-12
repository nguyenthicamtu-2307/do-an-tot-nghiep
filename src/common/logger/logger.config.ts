import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import Joi from 'joi';

export const loggerSchema = {
  LOG_LEVEL: Joi.string()
    .valid('trace', 'debug', 'info', 'warn', 'error')
    .default('info'),
};

export const loggerConfig = registerAs('logger', () => ({
  level: process.env.LOG_LEVEL ?? 'debug',
}));

@Injectable()
export class LoggerConfig {
  public readonly level: string;

  constructor(
    @Inject(loggerConfig.KEY)
    config: ConfigType<typeof loggerConfig>,
  ) {
    this.level = config.level!;
  }
}
