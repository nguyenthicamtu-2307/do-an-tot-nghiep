import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { v4 as uuid_v4 } from 'uuid';
import { LoggerConfig, loggerConfig, loggerSchema } from './logger.config';

export const ConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  load: [loggerConfig],
  validationSchema: Joi.object({
    ...loggerSchema,
  }),
  validationOptions: { abortEarly: true },
});

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [LoggerConfig],
      providers: [LoggerConfig],
      useFactory: async (config: LoggerConfig) => {
        return {
          pinoHttp: {
            level: config.level,
            genReqId: () => uuid_v4(),
            transport:
              process.env.NODE_ENV === 'local'
                ? { target: 'pino-pretty' }
                : undefined,
            useLevelLabels: true,
            redact: {
              paths: ['req.headers.authorization'],
              remove: true,
            },
          },
          exclude: [{ method: RequestMethod.GET, path: '/api/health' }],
        };
      },
    }),
  ],
})
export class LoggerModule {}
