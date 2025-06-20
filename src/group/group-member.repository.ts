import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';

@Injectable()
export class GroupMemberRepository extends Repository<GroupMember> {
  constructor(private readonly dataSource: DataSource) {
    super(GroupMember, dataSource.createEntityManager());
  }
}