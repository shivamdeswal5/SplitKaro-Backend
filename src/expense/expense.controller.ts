import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  findAll() {
    return this.expenseService.getAllExpenses();
  }
  @Post()
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(dto);
  }

  @Get('group/:groupId')
  getExpensesByGroup(@Param('groupId') groupId: string) {
    return this.expenseService.getExpensesByGroup(groupId);
  }

  @Get(':expenseId')
  getExpenseById(@Param('expenseId') expenseId: string) {
    return this.expenseService.getExpenseById(expenseId);
  }

  @Patch(':expenseId')
  updateExpense(
    @Param('expenseId') expenseId: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpense(expenseId, dto);
  }

  @Delete(':expenseId')
  deleteExpense(@Param('expenseId') expenseId: string) {
    return this.expenseService.deleteExpense(expenseId);
  }

  @Get('/user/:userId')
  async getUserExpenses(@Param('userId') userId: string): Promise<Expense[]> {
    return this.expenseService.getExpensesByUser(userId);
  }
}
