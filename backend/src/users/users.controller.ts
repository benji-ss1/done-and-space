import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Roles('super_admin','admin','manager')
  getAll(@Req() req: any) { return this.service.getAll(req.user); }

  @Post()
  @Roles('super_admin','admin')
  create(@Body() dto: any, @Req() req: any) { return this.service.create(dto, req.user); }

  @Patch(':id')
  @Roles('super_admin','admin')
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }
}
