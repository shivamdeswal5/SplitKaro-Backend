import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExpenseMembers } from './expense-members.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity('expense')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @Column()
  discription: string

  @Column()
  amount: string

  @Column({nullable:true})
  reciptUrl : string

  @OneToMany(()=>ExpenseMembers,expenseMember => expenseMember.expense)
  members: ExpenseMembers[]

  @ManyToOne(()=>Group, group=> group.expenses)
  group: Group

  @ManyToOne(()=>User, user=> user.createdExpenses)
  createdBy: User

  @ManyToOne(()=>Category, categories => categories.expenses)
  category: Category

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}