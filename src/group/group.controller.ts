import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUserToGroupDto } from './dto/add-user-to-group.dto';
import { RemoveUserFromGroupDto } from './dto/remove-user-from-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  getAllGroups() {
    return this.groupService.getAllGroups();
  }

  @Post('create-group')
  createGroup(@Body() dto: CreateGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Post('add-user')
  addUserToGroup(@Body() dto: AddUserToGroupDto) {
    return this.groupService.addUserToGroup(dto);
  }

  @Get('/user/:userId')
  async getUserGroups(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.groupService.getGroupsForUser(
      userId,
      Number(page),
      Number(limit),
      search,
    );
  }

  @Post('remove-user')
  removeUserFromGroup(@Body() dto: RemoveUserFromGroupDto) {
    return this.groupService.removeUserFromGroup(dto);
  }

  @Patch('update-group/:id')
  updateGroup(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupService.updateGroup(id, dto);
  }

  @Delete('delete-group/:id')
  deleteGroup(@Param('id') id: string) {
    return this.deleteGroup(id);
  }
}
