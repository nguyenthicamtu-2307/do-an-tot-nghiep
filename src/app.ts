import { ConfigModule } from '@config/module';
import { CacheModule, Module } from '@nestjs/common';
import { LoggerModule } from './common';
import { AdminModule } from './modules/admin';
import { AuthModule } from './modules/auth';
import { ContentModule } from './modules/content/content.module';
import { LocalOfficerModule } from './modules/localOfficer';
import { RescueTeamModule } from './modules/rescueTeam';
import { UserModule } from './modules/user';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LoggerModule,

    AuthModule,
    ContentModule,
    AdminModule,
    LocalOfficerModule,
    UserModule,
    RescueTeamModule,

    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
