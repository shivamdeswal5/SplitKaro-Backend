import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateGroupDto {

  @IsString({ message: 'Group Name Must Be String'})
  @IsNotEmpty()
  name: string;
  
} 