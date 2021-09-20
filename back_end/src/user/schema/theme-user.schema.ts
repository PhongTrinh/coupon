import { AutoMap } from "@automapper/classes";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Theme {
  @Prop()
  @AutoMap()
  headerPhotoLink: string;

  @Prop()
  @AutoMap()
  headerBackgroundColor: string;
}