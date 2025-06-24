import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(()=>User,user => user.groupsCreated,{eager:true})
  createdBy:User

  @OneToMany(() => GroupMember, member => member.group)
  members: GroupMember[];

  @OneToMany(() => Expense, expense => expense.group,{onDelete:'CASCADE',cascade:true})
  expenses: Expense[];

  @OneToMany(() => Settlement, s => s.group)
  settlements: Settlement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
