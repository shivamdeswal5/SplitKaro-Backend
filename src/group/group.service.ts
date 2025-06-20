import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupMemberRepository } from './group-member.repository';
import { UserRepository } from 'src/user/user.repository';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { GroupMember } from './entities/group-member.entity';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly groupMemberRepository: GroupMemberRepository,
        private readonly userRepository: UserRepository
    ){}

    async createGroup(dto:CreateGroupDto): Promise<Group>{
        const group = this.groupRepository.create({name:dto.name});
        return await this.groupRepository.save(group);
    }

    async getAllGroups(): Promise<Group[]>{
        return this.groupRepository.find({relations:['members']});
    }

    async addUserToGroup(dto:AddUserToGroupDto): Promise<GroupMember>{
        const {groupId, userId} = dto        
        const group = await this.groupRepository.findOne({where: {id:groupId}});
        if(!group){
            console.log(`Group with groupId: ${groupId} not found ...`);
            throw new NotFoundException(`Group with id: ${groupId}`);
        }
        const user = await this.userRepository.findOne({where:{id:userId}});
        if(!user){
            console.log(`User with Id: ${userId} not found ...`);
            throw new NotFoundException(`User with Id: ${userId} not found ...`);
        }
        const exists = await this.groupMemberRepository.findOne(
            {
                where: {
                    group:{id:groupId},
                    user: {id:userId}
                }
            }
        )
        console.log("Existing GroupMembers: ",exists);
        if(exists){
            console.log("User Already In Same Group ...");
            throw new BadRequestException('User Already present In Group');
        }
        const groupMember = this.groupMemberRepository.create({
            user,
            group
        })
        return await this.groupMemberRepository.save(groupMember);
        
    }   

    async removeUserFromGroup(dto:RemoveUserFromGroupDto): Promise<{ message: string }> {
        const {userId, groupId} = dto;
        const group = await this.groupRepository.findOne({where: {id:groupId}});
        if(!group){
            console.log(`Group with groupId: ${groupId} not found ...`);
            throw new NotFoundException(`Group with id: ${groupId}`);
        }
        const user = await this.userRepository.findOne({where:{id:userId}});
        if(!user){
            console.log(`User with Id: ${userId} not found ...`);
            throw new NotFoundException(`User with Id: ${userId} not found ...`);
        }
        const member = await this.groupMemberRepository.findOne(
            {
                where: {
                    group:{id:group.id},
                    user: {id:user.id}
                }
            }
        )
        console.log("Member: ",member)
        if(!member){
            console.log("User Doesnt Exists in Group ...");
            throw new BadRequestException('User Not Present In group');
        }

        await this.groupMemberRepository.remove(member);

        return {
            message: `User With Id: ${userId} has been remove from group with Id: ${groupId}`
        }
    }

    async getGroupsForUser(userId: string): Promise<Group[]>{
        console.log("User Id:",userId);
        const membership = await this.groupMemberRepository.find(
            {
                where: {user:{id:userId}},
                relations:['group']
            }
        )
        console.log("Memberships: ",membership);
        const groups = membership.map(member => member.group);
        console.log("Groups in which user is present: ",groups);
        return groups;
    }

    async updateGroup(groupId: string, dto:UpdateGroupDto):Promise<Group>{
        const group = await this.groupRepository.findOne({
            where:{id:groupId}
        });

        if(!group){
            console.log(`Group with Id: ${group} not found ..`);
            throw new NotFoundException('Group with Id: ${group} not found ..')
        }
        console.log("Current Group: ",group.name);
        console.log("Updated Group Name",dto.name);

        if (group.name == dto.name){
            console.log('Group name to be updated is same as current name please choose new name');
            throw new BadRequestException(`Current Group name and Update Group Name Is Same`);
        }
        if (dto.name !== undefined) {
            group.name = dto.name;
        } else {
            throw new BadRequestException('Group name is required');
        }

        if(dto.addUsersIds && dto.addUsersIds.length >0){
            for(const userId of dto.addUsersIds){
                const user = await this.userRepository.findOne({where:{id:userId}});
                if(!user){
                    console.log(`User With Id: ${userId} not found`);
                    throw new NotFoundException(`User With Id: ${userId}`);
                }

                const exists = await this.groupMemberRepository.findOne(
                    {
                        where:{
                            user:{id:user.id},
                            group:{id:group.id}
                        }
                    }
                )
                console.log("Exists: ",exists);
                if(!exists){
                    const groupMember = this.groupMemberRepository.create({
                        group,
                        user
                    })

                    await this.groupMemberRepository.save(groupMember);
                }else{
                    console.log(`user with id: ${user.id} already added in group`);
                    throw new NotAcceptableException(`User with id: ${user.id} already added in group`)
                }
            }
        }

        if(dto.removeUsersIds && dto.removeUsersIds.length>0){
            for(const userId of dto.removeUsersIds){
                const user = await this.userRepository.findOne({where:{id:userId}});
                if(!user){
                    console.log(`User With Id: ${userId} not found`);
                    throw new NotFoundException(`User With Id: ${userId}`);                    
                }
                const exists = await this.groupMemberRepository.find(
                    {
                        where:{
                            user:{id:user.id},
                            group:{id:group.id}
                        }
                    }
                )
                if(!exists){
                    console.log(`user does exist in group (cant be removed)`)
                    throw new NotAcceptableException(`User to be removed doesnt exists in groups`);
                }else{
                    const deleted = await this.groupMemberRepository.delete({
                        user: { id: user.id },
                        group: { id: group.id }
                    })

                }
            }
        }

        return await this.groupRepository.save(group);

    }
}
