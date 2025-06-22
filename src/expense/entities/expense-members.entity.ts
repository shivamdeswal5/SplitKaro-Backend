import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Expense } from './expense.entity';

@Entity('expense-members')
export class ExpenseMembers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Expense, expense => expense.members,{ onDelete: 'CASCADE' })
  expense: Expense;

  @ManyToOne(() => User, user => user.expenseMembers, { cascade: true })
  user: User;

  @Column({type:'numeric', default: 0 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
