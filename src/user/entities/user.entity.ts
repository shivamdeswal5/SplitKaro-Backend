import * as bcrypt from 'bcrypt';
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
import { GroupMember } from 'src/group/entities/group-member.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { ExpenseMembers } from 'src/expense/entities/expense-members.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { Group } from 'src/group/entities/group.entity';

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

  @Column({ default: 'unverified' })
  accountStatus: 'verified' | 'unverified';

  @Column({ nullable: true })
  profileImg: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(()=> Group, group =>group.createdBy)
  groupsCreated: Group[]

  @OneToMany(() => GroupMember, member => member.user)
  groupMember: GroupMember[];

  @OneToMany(() => Expense, expense => expense.createdBy)
  createdExpenses: Expense[];

  @OneToMany(() => ExpenseMembers, em => em.user)
  expenseMembers: ExpenseMembers[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => Settlement, s => s.paidBy)
  settlementsMade: Settlement[];

  @OneToMany(() => Settlement, s => s.paidTo)
  settlementsReceived: Settlement[];

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
