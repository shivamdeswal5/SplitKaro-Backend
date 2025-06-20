import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseRepository } from './expense.repository';
import { DataSource } from 'typeorm';
import { ExpenseMembers } from './entities/expense-members.entity';
import { ExpenseMembersRepository } from './expense-members.repository';

@Module({
 imports:[TypeOrmModule.forFeature([Expense,ExpenseMembers])],
      providers: [
         ExpenseService,
         {
           provide: ExpenseRepository,
           useFactory: (dataSource: DataSource) => {
             return dataSource.getRepository(Expense).extend(ExpenseRepository.prototype);
           },
           inject: [DataSource],
         },
          {
           provide: ExpenseMembersRepository,
           useFactory: (dataSource: DataSource) => {
             return dataSource.getRepository(ExpenseMembers).extend(ExpenseMembersRepository.prototype);
           },
           inject: [DataSource],
         },
       ],
     controllers: [ExpenseController],
     exports: [ExpenseRepository,ExpenseService,ExpenseMembersRepository],
 })

export class ExpenseModule {}
