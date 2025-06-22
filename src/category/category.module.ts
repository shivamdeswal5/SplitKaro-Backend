import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './category.repository';
import { DataSource } from 'typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Category])],
        providers: [
           CategoryService,
           {
             provide: CategoryRepository,
             useFactory: (dataSource: DataSource) => {
               return dataSource.getRepository(Category).extend(Category.prototype);
             },
             inject: [DataSource],
           },
         ],
       controllers: [CategoryController],
       exports: [CategoryRepository,CategoryService],
   })
export class CategoryModule {}
