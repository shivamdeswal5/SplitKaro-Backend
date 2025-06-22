import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupMemberRepository } from './group-member.repository';
import { UserRepository } from 'src/user/user.repository';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { GroupMember } from './entities/group-member.entity';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { NotificationRepository } from 'src/notification/notification.repository';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createGroup(dto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create({ name: dto.name });
    return await this.groupRepository.save(group);
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: ['members', 'members.user', 'expenses', 'settlements'],
    });
  }

  async addUserToGroup(dto: AddUserToGroupDto): Promise<GroupMember> {
    const { groupId, userId } = dto;
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      console.log(`Group with groupId: ${groupId} not found ...`);
      throw new NotFoundException(`Group with id: ${groupId}`);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      console.log(`User with Id: ${userId} not found ...`);
      throw new NotFoundException(`User with Id: ${userId} not found ...`);
    }
    const exists = await this.groupMemberRepository.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
      },
    });
    console.log('Existing GroupMembers: ', exists);
    if (exists) {
      console.log('User Already In Same Group ...');
      throw new BadRequestException('User Already present In Group');
    }
    const groupMember = this.groupMemberRepository.create({
      user,
      group,
    });
    return await this.groupMemberRepository.save(groupMember);
  }

  async removeUserFromGroup(
    dto: RemoveUserFromGroupDto,
  ): Promise<{ message: string }> {
    const { userId, groupId } = dto;
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      console.log(`Group with groupId: ${groupId} not found ...`);
      throw new NotFoundException(`Group with id: ${groupId}`);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      console.log(`User with Id: ${userId} not found ...`);
      throw new NotFoundException(`User with Id: ${userId} not found ...`);
    }
    const member = await this.groupMemberRepository.findOne({
      where: {
        group: { id: group.id },
        user: { id: user.id },
      },
    });
    console.log('Member: ', member);
    if (!member) {
      console.log('User Doesnt Exists in Group ...');
      throw new BadRequestException('User Not Present In group');
    }

    await this.groupMemberRepository.remove(member);

    return {
      message: `User With Id: ${userId} has been remove from group with Id: ${groupId}`,
    };
  }

  async getGroupsForUser(userId: string): Promise<Group[]> {
    console.log('User Id:', userId);
    const membership = await this.groupMemberRepository.find({
      where: { user: { id: userId } },
      relations: [
        'group',
        'group.members',
        'group.members.user',
        'group.expenses',
        'group.settlements',
      ],
    });
    console.log('Memberships: ', membership);
    const groups = membership.map((member) => member.group);
    console.log('Groups in which user is present: ', groups);
    return groups;
  }

  async updateGroup(groupId: string, dto: UpdateGroupDto): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found.`);
    }
    
    if (dto.name !== undefined) {
      if (group.name === dto.name) {
        throw new BadRequestException(
          'New group name is the same as the current one. Please provide a different name.',
        );
      }
      group.name = dto.name;
    }

    if (dto.addUsersIds && dto.addUsersIds?.length > 0) {
      for (const userId of dto.addUsersIds) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        const exists = await this.groupMemberRepository.findOne({
          where: {
            user: { id: user.id },
            group: { id: group.id },
          },
        });

        if (!exists) {
          const groupMember = this.groupMemberRepository.create({
            group,
            user,
          });
          await this.groupMemberRepository.save(groupMember);
        } else {
          throw new NotAcceptableException(
            `User with ID ${user.id} is already a member of this group.`,
          );
        }
      }
    }
    if (dto.removeUsersIds && dto.removeUsersIds?.length > 0) {
      for (const userId of dto.removeUsersIds) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        const exists = await this.groupMemberRepository.findOne({
          where: {
            user: { id: user.id },
            group: { id: group.id },
          },
        });

        if (!exists) {
          throw new NotAcceptableException(
            `User with ID ${userId} is not a member of this group.`,
          );
        }

        await this.groupMemberRepository.delete({
          user: { id: user.id },
          group: { id: group.id },
        });
      }
    }

    return await this.groupRepository.save(group);
  }
}
