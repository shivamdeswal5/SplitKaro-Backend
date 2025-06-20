import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('group-members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @ManyToOne(()=> Group, group => group.members,{cascade:true})
  group: Group

  @ManyToOne(()=>User, user =>user.groupMember, {cascade:true})
  user: User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}