import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { UserStatus } from '../enum/status.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  @AutoMap()
  userName: string;

  @Prop()
  @AutoMap()
  email: string;

  @Prop()
  @AutoMap()
  firstName: string;

  @Prop()
  @AutoMap()
  lastName: string;

  @Prop()
  @AutoMap()
  password: string;

  @Prop()
  @AutoMap()
  bio: string;

  @Prop()
  @AutoMap()
  avatar_link: string;

  @Prop()
  @AutoMap()
  github: string;

  @Prop()
  @AutoMap()
  linkedin: string;

  @Prop()
  @AutoMap()
  twitter: string;

  @Prop()
  @AutoMap()
  website: string;

  @Prop()
  @AutoMap()
  privateAccount: boolean;

  @Prop()
  @AutoMap()
  hideProfile: boolean;

  @Prop()
  forgotPasswordCode: string;

  @Prop()
  currentHashedRefreshToken: string;

  @Prop()
  tokenActiveEmail: string;

  @Prop()
  @AutoMap()
  isConnectGithub: boolean;

  @Prop({
    enum: [UserStatus.Active, UserStatus.InActive],
    default: UserStatus.InActive,
  })
  @AutoMap()
  status: string;

  @Prop({
    default: true,
  })
  @AutoMap()
  isFirstLogin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);