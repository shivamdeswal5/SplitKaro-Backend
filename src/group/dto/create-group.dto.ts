import {
  IsString,
} from 'class-validator';

export class CreateGroupDto {

  @IsString({ message: 'Group Name Must Be String'})
  name: string;
  
} 