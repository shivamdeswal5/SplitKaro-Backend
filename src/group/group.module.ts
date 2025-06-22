import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupRepository } from './group.repository';
import { DataSource } from 'typeorm';
import { GroupMemberRepository } from './group-member.repository';
import { GroupMember } from './entities/group-member.entity';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports:[TypeOrmModule.forFeature([Group,GroupMember]),UserModule,NotificationModule],
   providers: [
      GroupService,
      {
        provide: GroupRepository,
        useFactory: (dataSource: DataSource) => {
          return dataSource.getRepository(Group).extend(GroupRepository.prototype);
        },
        inject: [DataSource],
      },
      {
        provide: GroupMemberRepository,
        useFactory: (dataSource: DataSource) => {
          return dataSource.getRepository(GroupMember).extend(GroupMemberRepository.prototype);
        },
        inject: [DataSource],
      },
    ],
  controllers: [GroupController],
  exports: [GroupRepository,GroupService,GroupMemberRepository],
})
export class GroupModule {}
