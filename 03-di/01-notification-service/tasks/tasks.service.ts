import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class TasksService {
  @Inject(NotificationsService)
  private notificationsService: NotificationsService;

  @Inject(UsersService)
  private usersService: UsersService;

  private tasks: Task[] = [];

  constructor() {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };
    this.tasks.push(task);

    const user = this.usersService.getUserById(assignedTo);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${assignedTo} не найден`);
    }

    const subject = "Новая задача";
    const message = `Вы назначены ответственным за задачу: "${title}"`;

    this.notificationsService.sendEmail(user.email, subject, message);

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    Object.assign(task, updateTaskDto);

    const { title, status, assignedTo } = task;
    const user = this.usersService.getUserById(assignedTo);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${assignedTo} не найден`);
    }

    const message = `Статус задачи "${title}" обновлён на "${status}"`;

    this.notificationsService.sendSMS(user.phone, message);

    return task;
  }
}
