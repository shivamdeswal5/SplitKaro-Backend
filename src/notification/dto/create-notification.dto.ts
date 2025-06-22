import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['group', 'expense', 'settlement'])
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;
}
