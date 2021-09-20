import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordCodeUserDto {
  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}