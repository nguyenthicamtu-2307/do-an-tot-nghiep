import { PrismaService } from '@db';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { Module } from '@nestjs/common';
import * as useCases from './application';
import * as services from './services';

const ConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  validationOptions: { abortEarly: true },
});

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter((x) => x.name.endsWith('Handler'));

const Services = [PrismaService, ...Object.values(services)];

@Module({
  imports: [ConfigModule, CqrsModule],
  controllers: [...endpoints],

  providers: [...Services, ...handlers],
  exports: [],
})
export class AdminModule {}
