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
import { NotificationRepository } from 'src/notification/notification.repository';
import { ExpenseMembersRepository } from 'src/expense/expense-members.repository';
import { ExpenseRepository } from 'src/expense/expense.repository';

@Injectable()
export class SettlementService {
  constructor(
    private readonly settlementRepository: SettlementRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly expenseRepository: ExpenseRepository,
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

    const savedSettlement = await this.settlementRepository.save(settlement);

    const notification = this.notificationRepository.create({
      user: paidTo,
      type: 'settlement',
      message: `${paidBy} settled ₹${amount} with you in group "${group.name}"`,
    });

    await this.notificationRepository.save(notification);

    return savedSettlement;
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

  async getUserBalancesInGroup(
    groupId: string,
  ): Promise<Record<string, number>> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    const expenses = await this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['members', 'members.user', 'createdBy'],
    });

    const settlements = await this.settlementRepository.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'paidTo'],
    });

    const balances: Record<string, number> = {};

    for (const expense of expenses) {
      const paidById = expense.createdBy?.id;
      if (!paidById) continue;

      if (!balances[paidById]) balances[paidById] = 0;

      for (const member of expense.members) {
        const userId = member.user?.id;
        const amount = Number(member.amount);

        // Validate amount
        if (!userId || isNaN(amount)) continue;

        if (!balances[userId]) balances[userId] = 0;

        if (userId !== paidById) {
          balances[userId] -= amount;
          balances[paidById] += amount;
        }
      }
    }

    for (const settlement of settlements) {
      const { paidBy, paidTo, amount } = settlement;
      const amt = Number(amount);

      if (!paidBy?.id || !paidTo?.id || isNaN(amt)) continue;

      if (!balances[paidBy.id]) balances[paidBy.id] = 0;
      if (!balances[paidTo.id]) balances[paidTo.id] = 0;

      balances[paidBy.id] -= amt;
      balances[paidTo.id] += amt;
    }

    return balances;
  }
}
