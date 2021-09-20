import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordUserDto {
  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @MinLength(8)
  forgotPasswordCode: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
