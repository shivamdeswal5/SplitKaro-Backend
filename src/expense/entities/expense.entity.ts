import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('expense')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

}