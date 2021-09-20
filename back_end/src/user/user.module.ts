import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { SignUpUserDto } from './dto/signup-user.dto';
import { MailModule } from 'src/mail/mail.module';
;

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema},
    ]),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, SignUpUserDto],
  exports: [UserService, SignUpUserDto],
})
export class UserModule {}