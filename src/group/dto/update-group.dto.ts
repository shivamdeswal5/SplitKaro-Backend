import {
    ArrayMinSize,
    IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateGroupDto {

  @IsOptional()
  @IsString({ message: 'Group Name Must Be String'})
  name?: string;

  @IsOptional()
  @IsArray()
  addUsersIds?: string[];

  @IsOptional()
  @IsArray()
  removeUsersIds?: string[];
  
} 