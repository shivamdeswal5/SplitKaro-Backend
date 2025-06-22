import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseRepository } from './expense.repository';
import { DataSource } from 'typeorm';
import { ExpenseMembers } from './entities/expense-members.entity';
import { ExpenseMembersRepository } from './expense-members.repository';
import { UserModule } from '../user/user.module';
import { GroupModule } from 'src/group/group.module';
import { CategoryModule } from 'src/category/category.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
 imports:[TypeOrmModule.forFeature([Expense,ExpenseMembers]),UserModule,GroupModule,CategoryModule,NotificationModule],
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
