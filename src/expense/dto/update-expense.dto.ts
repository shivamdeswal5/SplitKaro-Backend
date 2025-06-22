import { IsOptional, IsString, IsUUID, IsNumber, IsArray } from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  reciptUrl?: string;

  @IsOptional()
  @IsArray()
  participantIds?: string[];

  @IsOptional()
  @IsArray()
  splitAmounts?: { userId: string; amount: number }[];
}
