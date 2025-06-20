import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExpenseMembers } from './entities/expense-members.entity';

@Injectable()
export class ExpenseMembersRepository extends Repository<ExpenseMembers> {
  constructor(private readonly dataSource: DataSource) {
    super(ExpenseMembers, dataSource.createEntityManager());
  }
}