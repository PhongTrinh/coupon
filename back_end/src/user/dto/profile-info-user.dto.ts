import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProfileInfoUserDto {

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @AutoMap()
  readonly bio: string;

  @ApiProperty()
  @AutoMap()
  readonly avatar_link: string;

  @ApiProperty()
  @AutoMap()
  readonly github: string;

  @ApiProperty()
  @AutoMap()
  readonly linkedin: string;

  @ApiProperty()
  @AutoMap()
  readonly twitter: string;

  @ApiProperty()
  @AutoMap()
  readonly website: string;
}
