import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  reciptUrl?: string;

  @IsNotEmpty()
  @IsUUID()
  groupId: string;

  @IsNotEmpty()
  @IsUUID()
  createdById: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  participantIds: string[];


  @IsOptional()
  @IsArray()
  splitAmounts?: { userId: string; amount: number }[];
}
