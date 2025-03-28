import { IsEnum } from "class-validator";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getFilteredTasks(
    status?: TaskStatus,
    page?: number,
    limit?: number,
    sortBy?: string,
  ) {
    let filteredTasks = [];
    const isStatusValid = Object.values(TaskStatus).includes(status);
    const isSortByValid = sortBy === "title" || sortBy === "status";
    const isPageLimitValid = page > 0 && limit > 0;

    if (
      (status && !isStatusValid) ||
      (page && limit && !isPageLimitValid) ||
      (sortBy && !isSortByValid)
    ) {
      throw new BadRequestException();
    }

    filteredTasks = status
      ? this.tasks.filter((task) => task.status == status)
      : this.tasks;

    if (page && limit) {
      filteredTasks = filteredTasks.slice((page - 1) * limit, page * limit);
    }

    if (sortBy && isSortByValid) {
      filteredTasks.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }

    return filteredTasks;
  }
}
