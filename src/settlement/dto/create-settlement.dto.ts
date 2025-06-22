import { IsUUID, IsNotEmpty, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreateSettlementDto {
  @IsUUID()
  @IsNotEmpty()
  paidById: string;

  @IsUUID()
  @IsNotEmpty()
  paidToId: string;

  @IsUUID()
  @IsNotEmpty()
  groupId: string;

  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}