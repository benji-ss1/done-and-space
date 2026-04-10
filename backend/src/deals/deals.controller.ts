import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('deals')
export class DealsController {
  constructor(private readonly service: DealsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','agent')
  @Post()
  create(@Body() dto: any, @Req() req: any) { return this.service.create(dto, req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  @Get()
  findAll(@Req() req: any) { return this.service.findAll(req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  @Get('summary')
  getSummary(@Req() req: any) { return this.service.getPipelineSummary(req.user); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','compliance','agent')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','agent')
  @Patch(':id/stage')
  advanceStage(@Param('id') id: string, @Body('stage') stage: string, @Body('notes') notes: string, @Req() req: any) {
    return this.service.advanceStage(id, stage, notes, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager','staff','agent')
  @Patch(':id/price')
  updatePrice(@Param('id') id: string, @Body('agreed_price') price: number, @Req() req: any) {
    return this.service.updatePrice(id, price, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin','admin','manager')
  @Patch(':id/commission/approve')
  approveCommission(@Param('id') id: string, @Req() req: any) { return this.service.approveCommission(id, req.user); }
}
