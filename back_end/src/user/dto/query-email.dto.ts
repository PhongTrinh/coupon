import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueryEmailDto {
  @ApiProperty()
  text: string;
}
