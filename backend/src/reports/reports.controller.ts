import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('dashboard')
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  getDashboard(@Req() req: any) { return this.service.getDashboard(req.user); }

  @Get('leads')
  @Roles('super_admin','admin','manager')
  getLeads(@Req() req: any) { return this.service.getLeadReport(req.user); }

  @Get('agents')
  @Roles('super_admin','admin','manager')
  getAgents(@Req() req: any) { return this.service.getAgentPerformance(req.user); }

  @Get('listings')
  @Roles('super_admin','admin','manager')
  getListings(@Req() req: any) { return this.service.getListingsReport(req.user); }
}
