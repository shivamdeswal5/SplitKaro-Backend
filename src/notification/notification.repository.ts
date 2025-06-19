import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<Notifications> {
  constructor(private readonly dataSource: DataSource) {
    super(Notifications, dataSource.createEntityManager());
  }
}