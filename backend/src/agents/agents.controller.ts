import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('agents')
export class AgentsController {
  constructor(private readonly service: AgentsService) {}

  @Post('apply')
  apply(@Body() dto: any) {
    return this.service.apply(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'manager')
  @Get('applications')
  getApplications(@Query() params: any) {
    return this.service.getApplications(params);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin', 'manager')
  @Patch('applications/:id')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('notes') notes: string,
    @Req() req: any,
  ) {
    return this.service.updateStatus(id, status, notes, req.user.sub);
  }
}
