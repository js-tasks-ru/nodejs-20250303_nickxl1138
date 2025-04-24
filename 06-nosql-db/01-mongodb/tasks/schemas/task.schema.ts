import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import getDefaultDeadline from "../../helpers/get-default-deadline";
import { HydratedDocument } from "mongoose";

export type TaskDocument = HydratedDocument<Task>;

const DEFAULT_DEADLINE = 14;
const DEFAULT_PRIORITY = 3;

@Schema({ versionKey: false })
export class Task {
  @Prop({
    unique: true,
  })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: DEFAULT_PRIORITY })
  priority: number;

  @Prop({ default: getDefaultDeadline(DEFAULT_DEADLINE) })
  deadline: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
