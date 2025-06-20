import * as bcrypt from 'bcrypt';
import { ExpenseMembers } from 'src/expense/entities/expense-members.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { GroupMember } from 'src/group/entities/group-member.entity';
import { Notifications } from 'src/notification/entities/notification.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({default:'unverified'})
  accountStatus: 'verified' | 'unverified';

  @Column({ type: 'varchar',  nullable: true })
  profileImg: string;

  @Column({ type: 'varchar',  nullable: true })
  refreshToken: string;

  @OneToMany(()=>GroupMember, member=> member.user)
  groupMember: GroupMember[]

  @OneToMany(() => Expense, expense => expense.createdBy)
  createdExpenses: Expense[]

  @OneToMany(()=>ExpenseMembers, expenseMember => expenseMember.user)
  expenseMembers: ExpenseMembers[]

  @OneToMany(()=>Notifications, notification => notification.user)
  notifications: Notifications[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

}