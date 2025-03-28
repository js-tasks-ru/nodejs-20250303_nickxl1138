import { IsEnum, IsNotEmpty } from "class-validator";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export class Task {
  id?: string;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
