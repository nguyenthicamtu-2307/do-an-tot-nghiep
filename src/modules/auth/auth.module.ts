import { PrismaService } from '@db';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as useCases from './application';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategy';

const ConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  validationOptions: { abortEarly: true },
});

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter((x) => x.name.endsWith('Handler'));

const Services = [PrismaService];
const Strategies = [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy];

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  controllers: [...endpoints],

  providers: [...Services, ...handlers, ...Strategies],
  exports: [],
})
export class AuthModule {}
