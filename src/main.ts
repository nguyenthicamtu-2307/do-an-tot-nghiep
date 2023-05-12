import { configureSwagger, useLogger } from '@common';
import { ApiConfig } from '@config/api.config';
import { AppConfig } from '@config/app.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import compression from 'compression';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app';
import {
  GlobalExceptionFilter,
  TimeoutInterceptor,
  useServingFavIcon,
} from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const { name, env, isProduction } = app.get(AppConfig);
  const { prefix, version } = app.get(ApiConfig);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  useServingFavIcon(app);

  app.use(helmet());
  useLogger(app);
  app.use(compression());
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true }));

  app.enableCors();
  app.enableVersioning();

  app.useGlobalFilters(
    new GlobalExceptionFilter({ includeSensitive: !isProduction }),
  );
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      // handling PATCH
      // skipMissingProperties: true,
      // disableErrorMessages: isProduction,
      transform: true,
    }),
  );
  app.setGlobalPrefix(prefix);

  configureSwagger(app, version, prefix, (builder) => {
    builder.setTitle(`${name} - ${env}`).setDescription(name);
  });

  const config = app.get(AppConfig);
  const server = await app.listen(config.port);

  server.keepAliveTimeout = 65 * 1000; // Ensure all inactive connections are terminated by the ALB, by setting this a few seconds higher than the ALB idle timeout
  server.headersTimeout = 66 * 1000; // Ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363

  const url = await app.getUrl();
  Logger.log(`${url}/${prefix}/swagger`);

  return config;
}

bootstrap()
  .then((config: AppConfig) => {
    new Logger('Bootstrap').log(
      { config },
      `Server is listening on port ${config.port}, environment=${config.env}`,
    );
  })
  .catch((err) => {
    new Logger('Bootstrap').error(`Error starting server, ${err}`);
    throw err;
  });
