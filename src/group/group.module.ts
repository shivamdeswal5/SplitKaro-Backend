import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupRepository } from './group.repository';
import { DataSource } from 'typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Group])],
   providers: [
      GroupService,
      {
        provide: GroupRepository,
        useFactory: (dataSource: DataSource) => {
          return dataSource.getRepository(Group).extend(GroupRepository.prototype);
        },
        inject: [DataSource],
      },
    ],
  controllers: [GroupController],
  exports: [GroupRepository,GroupService],
})
export class GroupModule {}
