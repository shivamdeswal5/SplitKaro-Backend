import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseRepository } from './expense.repository';
import { DataSource } from 'typeorm';

@Module({
 imports:[TypeOrmModule.forFeature([Expense])],
      providers: [
         ExpenseService,
         {
           provide: ExpenseRepository,
           useFactory: (dataSource: DataSource) => {
             return dataSource.getRepository(Expense).extend(ExpenseRepository.prototype);
           },
           inject: [DataSource],
         },
       ],
     controllers: [ExpenseController],
     exports: [ExpenseRepository,ExpenseService],
 })

export class ExpenseModule {}
