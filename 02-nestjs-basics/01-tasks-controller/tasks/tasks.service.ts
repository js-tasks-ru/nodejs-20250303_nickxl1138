import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTaskById(id: string) {
    const taskFindById = this.tasks.find((task) => task.id == id);

    if (!taskFindById) {
      throw new NotFoundException();
    }

    return taskFindById;
  }

  createTask(task: Task) {
    this.tasks.push({ id: String(this.tasks.length + 1), ...task });
    return this.tasks.at(-1);
  }

  updateTask(id: string, update: Task) {
    const taskIndexFindById = this.tasks.findIndex((task) => task.id == id);

    if (taskIndexFindById === -1) {
      throw new NotFoundException();
    }

    const newTask = { id: id, ...update };

    this.tasks.splice(taskIndexFindById, 1, newTask);

    return newTask;
  }

  deleteTask(id: string) {
    const taskIndexFindById = this.tasks.findIndex((task) => task.id == id);

    if (taskIndexFindById === -1) {
      throw new NotFoundException();
    }

    let deletedTask = this.tasks.splice(taskIndexFindById, 1)[0];

    deletedTask = { ...deletedTask, status: TaskStatus.PENDING };

    return deletedTask;
  }
}
