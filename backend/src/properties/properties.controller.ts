import {
  Controller, Get, Post, Put, Patch, Body, Param, Query,
  UseGuards, Req, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePropertyDto } from '../dto/all.dto';
import { UpdatePropertyDto } from '../dto/all.dto';
import { SearchPropertiesDto } from '../dto/all.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  // ── PUBLIC ──
  @Get()
  search(@Query() filters: SearchPropertiesDto) {
    return this.service.search(filters);
  }

  @Get('public/:id')
  findPublicById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findPublicById(id);
  }

  // ── AUTHENTICATED ──
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('admin/all')
  @Roles('super_admin', 'admin', 'manager', 'staff', 'compliance', 'agent')
  findAll(@Query() filters: any, @Req() req: any) {
    return this.service.findAll(filters, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('admin/pending-approvals')
  @Roles('super_admin', 'admin', 'manager', 'compliance')
  getPendingApprovals(@Req() req: any) {
    return this.service.getPendingApprovals(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @Roles('super_admin', 'admin', 'manager', 'agent', 'staff')
  create(@Body() dto: CreatePropertyDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Put(':id')
  @Roles('super_admin', 'admin', 'manager', 'agent', 'staff')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id/submit')
  @Roles('super_admin', 'admin', 'manager', 'agent', 'staff')
  @HttpCode(HttpStatus.OK)
  submit(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.submitForApproval(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id/approve')
  @Roles('super_admin', 'admin', 'manager', 'compliance')
  @HttpCode(HttpStatus.OK)
  approve(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.approve(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id/publish')
  @Roles('super_admin', 'admin', 'manager')
  @HttpCode(HttpStatus.OK)
  publish(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.publish(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id/reject')
  @Roles('super_admin', 'admin', 'manager', 'compliance')
  @HttpCode(HttpStatus.OK)
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return this.service.reject(id, reason, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id/archive')
  @Roles('super_admin', 'admin', 'manager')
  @HttpCode(HttpStatus.OK)
  archive(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.archive(id, req.user);
  }
}
