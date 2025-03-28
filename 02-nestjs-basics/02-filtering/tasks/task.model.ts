export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export class Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
}
