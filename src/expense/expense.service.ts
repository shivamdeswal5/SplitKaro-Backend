import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExpenseRepository } from './expense.repository';
import { ExpenseMembersRepository } from './expense-members.repository';
import { UserRepository } from 'src/user/user.repository';
import { GroupRepository } from 'src/group/group.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './entities/expense.entity';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseMembers } from './entities/expense-members.entity';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly expenseMembersRepository: ExpenseMembersRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllExpenses(): Promise<Expense[]> {
    return this.expenseRepository.find({
      relations: ['createdBy', 'group', 'members', 'members.user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async createExpense(dto: CreateExpenseDto): Promise<Expense> {
    const {
      name,
      description,
      amount,
      reciptUrl,
      groupId,
      createdById,
      categoryId,
      participantIds,
      splitAmounts,
    } = dto;

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    const createdBy = await this.userRepository.findOne({
      where: { id: createdById },
    });
    if (!createdBy) throw new NotFoundException('Creator user not found');

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    if (!participantIds || participantIds.length === 0) {
      throw new BadRequestException('At least one participant is required');
    }

    const expense = this.expenseRepository.create({
      name,
      description,
      amount,
      reciptUrl,
      group,
      createdBy,
      category,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    // split Equal or unequal
    if (splitAmounts && splitAmounts.length > 0) {
      for (const split of splitAmounts) {
        const user = await this.userRepository.findOne({
          where: { id: split.userId },
        });
        if (!user) continue;

        const expenseMember = this.expenseMembersRepository.create({
          user,
          expense: savedExpense,
          amount: split.amount,
        });

        await this.expenseMembersRepository.save(expenseMember);
      }
    } else {
      // Equal split
      const splitValue = amount / participantIds.length;
      for (const userId of participantIds) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (!user) continue;

        const expenseMember = this.expenseMembersRepository.create({
          user,
          expense: savedExpense,
          amount: splitValue,
        });

        await this.expenseMembersRepository.save(expenseMember);
      }
    }

    return savedExpense;
  }

  async getExpensesByGroup(groupId: string): Promise<Expense[]> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Group not found');

    return this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['createdBy', 'members', 'members.user', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExpenseById(expenseId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['createdBy', 'group', 'members', 'members.user', 'category'],
    });

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async updateExpense(
    expenseId: string,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['members'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (dto.name) expense.name = dto.name;
    if (dto.description) expense.description = dto.description;
    if (dto.amount) expense.amount = dto.amount;
    if (dto.reciptUrl) expense.reciptUrl = dto.reciptUrl;

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      expense.category = category;
    }

    if (dto.participantIds || dto.splitAmounts) {
      await this.expenseMembersRepository.delete({
        expense: { id: expenseId },
      });

      const newMembers: ExpenseMembers[] = [];

      if (dto.splitAmounts && dto.splitAmounts.length > 0) {
        for (const split of dto.splitAmounts) {
          const user = await this.userRepository.findOne({
            where: { id: split.userId },
          });
          if (!user) continue;

          const member = this.expenseMembersRepository.create({
            user,
            expense,
            amount: split.amount,
          });

          newMembers.push(await this.expenseMembersRepository.save(member));
        }
      } else if (dto.participantIds && dto.amount) {
        const splitAmount =
          parseFloat(String(dto.amount)) / dto.participantIds.length;

        for (const userId of dto.participantIds) {
          const user = await this.userRepository.findOne({
            where: { id: userId },
          });
          if (!user) continue;

          const member = this.expenseMembersRepository.create({
            user,
            expense,
            amount: splitAmount,
          });

          newMembers.push(await this.expenseMembersRepository.save(member));
        }
      }

      expense.members = newMembers;
    }

    await this.expenseRepository.save(expense);

    const updated = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['createdBy', 'group', 'members', 'members.user', 'category'],
    });

    if (!updated) {
      throw new NotFoundException('Failed to fetch updated expense');
    }

    return updated;
  }

  async deleteExpense(expenseId: string): Promise<{ message: string }> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
    });
    if (!expense) throw new NotFoundException('Expense not found');

    await this.expenseMembersRepository.delete({ expense: { id: expenseId } });
    await this.expenseRepository.remove(expense);

    return { message: 'Expense deleted successfully' };
  }

  async getExpensesByUser(userId: string): Promise<Expense[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const expenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.members', 'member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('expense.createdBy', 'createdBy')
      .leftJoinAndSelect('expense.group', 'group')
      .leftJoinAndSelect('expense.category', 'category')
      .where('member.user.id = :userId', { userId })
      .orderBy('expense.createdAt', 'DESC')
      .getMany();

    return expenses;
  }
}
