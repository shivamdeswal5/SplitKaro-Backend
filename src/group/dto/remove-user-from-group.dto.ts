import {
  IsString,
} from 'class-validator';

export class RemoveUserFromGroupDto {

  @IsString({ message: 'Group Id must be string'})
  groupId: string;

  @IsString({ message: 'User Id must be string'})
  userId: string;
  
} 