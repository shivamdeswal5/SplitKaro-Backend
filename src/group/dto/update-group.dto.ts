import {
    ArrayMinSize,
    IsArray,
  IsString,
} from 'class-validator';

export class UpdateGroupDto {

  @IsString({ message: 'Group Name Must Be String'})
  name: string;

  @IsArray()
  @ArrayMinSize(1,{message:"Provide Atleast One User Id To Update Group: "})
  addUsersIds: string[];

  @IsArray()
  @ArrayMinSize(1,{message:"Provide Atleast One User Id To Remove User From Group: "})
  removeUsersIds: string[];
  
} 