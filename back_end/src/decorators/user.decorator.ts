import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export class UserDto {
  @IsNotEmpty()
  readonly userId: string;
}
