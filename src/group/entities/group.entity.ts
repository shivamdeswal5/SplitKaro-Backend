import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Expense } from 'src/expense/entities/expense.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @OneToMany(()=> GroupMember, member => member.group)
  members: GroupMember[]

  @OneToMany(()=> Expense, expense => expense.group)
  expenses: Expense[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}