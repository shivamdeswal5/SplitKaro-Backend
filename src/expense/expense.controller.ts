import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.expenseService.getAllExpenses(+page, +limit, search);
  }

  @Post()
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(dto);
  }

  @Get('group/:groupId')
  getExpensesByGroup(
    @Param('groupId') groupId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.expenseService.getExpensesByGroup(groupId, +page, +limit, search);
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
  getUserExpenses(
    @Param('userId') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.expenseService.getExpensesByUser(userId, +page, +limit, search);
  }
}
