import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { LeadsModule } from './leads/leads.module';
import { DealsModule } from './deals/deals.module';
import { ReportsModule } from './reports/reports.module';
import { AgentsModule } from './agents/agents.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PropertiesModule,
    LeadsModule,
    DealsModule,
    ReportsModule,
    AgentsModule,
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
