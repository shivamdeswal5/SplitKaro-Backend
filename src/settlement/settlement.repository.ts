import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Settlement } from './entities/settlement.entity';

@Injectable()
export class SettlementRepository extends Repository<Settlement> {
  constructor(private readonly dataSource: DataSource) {
    super(Settlement, dataSource.createEntityManager());
  }
}