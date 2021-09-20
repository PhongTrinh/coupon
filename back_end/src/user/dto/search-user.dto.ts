import { ApiProperty } from "@nestjs/swagger";

export class SearchUserDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()

  readonly pageSize: number;

  @ApiProperty()
  readonly search: string;
}


