import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expense } from './expense.entity';

@Entity('expense-members')
export class ExpenseMembers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=> Expense, expense => expense.members,{cascade:true})
  expense: Expense

  @ManyToOne(()=>User, user=> user.expenseMembers,{cascade:true})
  user:User

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;


}