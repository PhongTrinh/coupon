import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags} from '@nestjs/swagger';

import { UserService } from './user.service';

import JwtAccessAuthGuard from 'src/auth/guards/jwt-access-auth.guard';
import { User, UserDto } from 'src/decorators/user.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('/me')
  @UseGuards(JwtAccessAuthGuard)
  async getMe(
    @User() user: UserDto,
  ) {
    return this.userService.findById(user.userId);
  }
}

