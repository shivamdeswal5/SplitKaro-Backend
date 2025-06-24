import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { ExpenseMembers } from './expense-members.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity('expense')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('numeric', { default: 0 })
  amount: number;

  @Column({ nullable: true })
  reciptUrl: string;

  @OneToMany(() => ExpenseMembers, em => em.expense,{
  cascade: true,
  eager: true,
})
  members: ExpenseMembers[];

  @ManyToOne(() => Group, group => group.expenses)
  group: Group;

  @ManyToOne(() => User, user => user.createdExpenses)
  createdBy: User;

  @ManyToOne(() => Category, c => c.expenses, { nullable: true, onDelete: 'SET NULL' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}
