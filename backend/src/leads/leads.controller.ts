import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Post('inquiry')
  createPublic(@Body() dto: any) { return this.service.createPublic(dto); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  @Get()
  findAll(@Query() filters: any, @Req() req: any) { return this.service.findAll(filters, req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  @Get('stats')
  getStats(@Req() req: any) { return this.service.getStats(req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','agent')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req: any) { return this.service.update(id, dto, req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager')
  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body('agent_id') agentId: string, @Req() req: any) { return this.service.assign(id, agentId, req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','agent')
  @Post(':id/interact')
  logInteraction(@Param('id') id: string, @Body() dto: any, @Req() req: any) { return this.service.logInteraction(id, dto, req.user); }
}
