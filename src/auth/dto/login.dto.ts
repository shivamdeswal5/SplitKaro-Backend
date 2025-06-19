import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class loginDto {

 @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters.' })
  password: string;

  @IsOptional()
  @IsString()
  otp?: string;
}