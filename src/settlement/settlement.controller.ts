import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { Settlement } from './entities/settlement.entity';

@Controller('settlements')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Post()
  async create(@Body() dto: CreateSettlementDto): Promise<Settlement> {
    return this.settlementService.createSettlement(dto);
  }

  @Get('group/:groupId')
  async getByGroup(@Param('groupId') groupId: string): Promise<Settlement[]> {
    return this.settlementService.getSettlementsByGroup(groupId);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string): Promise<Settlement[]> {
    return this.settlementService.getSettlementsByUser(userId);
  }
}
