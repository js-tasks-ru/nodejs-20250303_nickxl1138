import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schemas/task.schema";
import { Model, ObjectId } from "mongoose";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private TaskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.TaskModel.create(createTaskDto);
  }

  async findAll() {
    return await this.TaskModel.find();
  }

  async findOne(id: ObjectId) {
    const task = await this.TaskModel.findById(id);

    if (!task) {
      throw new NotFoundException(`Задача с таким ID не найдена`);
    }

    return task;
  }

  async update(id: ObjectId, updateTaskDto: UpdateTaskDto) {
    const task = await this.TaskModel.findByIdAndUpdate(id, updateTaskDto, {
      returnDocument: "after",
    });

    if (!task) {
      throw new NotFoundException(`Задача с таким ID не найдена`);
    }

    return task;
  }

  async remove(id: ObjectId) {
    const task = await this.TaskModel.findByIdAndDelete(id);

    if (!task) {
      throw new NotFoundException(`Задача с таким ID не найдена`);
    }

    return { message: "Задача успешно удалена" };
  }
}
