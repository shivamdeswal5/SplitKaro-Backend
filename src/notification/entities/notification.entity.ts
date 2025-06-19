import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn('uuid')
  id: string;

}