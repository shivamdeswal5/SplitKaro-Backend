import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Categories } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Categories> {
  constructor(private readonly dataSource: DataSource) {
    super(Categories, dataSource.createEntityManager());
  }
}