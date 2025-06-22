import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SettlementRepository } from './settlement.repository';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { Settlement } from './entities/settlement.entity';
import { UserRepository } from 'src/user/user.repository';
import { GroupRepository } from 'src/group/group.repository';

@Injectable()
export class SettlementService {
  constructor(
    private readonly settlementRepository: SettlementRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async createSettlement(dto: CreateSettlementDto): Promise<Settlement> {
    const { paidById, paidToId, groupId, amount, note } = dto;

    const paidBy = await this.userRepository.findOne({
      where: { id: paidById },
    });
    if (!paidBy) throw new NotFoundException('PaidBy user not found');

    const paidTo = await this.userRepository.findOne({
      where: { id: paidToId },
    });
    if (!paidTo) throw new NotFoundException('PaidTo user not found');

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    if (paidById === paidToId) {
      throw new BadRequestException("Can't settle with yourself");
    }

    const settlement = this.settlementRepository.create({
      paidBy,
      paidTo,
      group,
      amount,
      note,
    });

    return await this.settlementRepository.save(settlement);
  }

  async getSettlementsByGroup(groupId: string): Promise<Settlement[]> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    return await this.settlementRepository.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'paidTo', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserSettlements(userId: string): Promise<Settlement[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return await this.settlementRepository.find({
      where: [{ paidBy: { id: userId } }, { paidTo: { id: userId } }],
      relations: ['paidBy', 'paidTo', 'group'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSettlementsByUser(userId: string): Promise<Settlement[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.settlementRepository.find({
      where: [{ paidBy: { id: userId } }, { paidTo: { id: userId } }],
      relations: ['paidBy', 'paidTo', 'group'],
      order: { createdAt: 'DESC' },
    });
  }
}
