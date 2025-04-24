import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;

    await this.taskRepository.save(task);

    return task;
  }

  async findAll(page?: number, limit?: number) {
    const isPageAndLimitValid = page > 0 && limit > 0;
    const isPageAndLimitNotEmpty = page && limit;

    if (isPageAndLimitNotEmpty && !isPageAndLimitValid) {
      throw new BadRequestException(`Некорректные параметры "page" и "limit"`);
    }

    if (isPageAndLimitNotEmpty) {
      return await this.taskRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({ where: { id: id } });

    if (!task) {
      throw new NotFoundException(`Задача с таким id - "${id}" не найдена`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const taskToUpdate = await this.findOne(id);

    Object.assign(taskToUpdate, { ...updateTaskDto });

    await this.taskRepository.save(taskToUpdate);

    return taskToUpdate;
  }

  async remove(id: number): Promise<{ message: string }> {
    const taskToRemove = await this.findOne(id);

    await this.taskRepository.delete(taskToRemove);

    return { message: "Task deleted successfully" };
  }
}
