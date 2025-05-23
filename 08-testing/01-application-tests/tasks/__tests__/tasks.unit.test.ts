import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "../tasks.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

describe("TasksService", () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockTask = {
    id: 1,
    title: "Новая задача 1",
    description: "Взять себя в руки",
    isCompleted: false,
  };

  const taskDoesNotExistsHelper = async () => {
    mockTasksRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(mockTask.id)).rejects.toThrow(
      NotFoundException,
    );

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockTask.id });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const task = {
        title: "Новая задача 1",
        description: "Взять себя в руки",
      };

      mockTasksRepository.create.mockReturnValue(mockTask);
      mockTasksRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(task as CreateTaskDto);

      expect(repository.create).toHaveBeenCalledWith(task);
      expect(repository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      mockTasksRepository.find.mockResolvedValue([mockTask]);
      const result = await service.findAll();
      expect(result).toEqual([mockTask]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a task when it exists", async () => {
      mockTasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await service.findOne(mockTask.id);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: mockTask.id,
      });

      expect(result).toEqual(mockTask);
    });

    it("should throw NotFoundException when task does not exist", async () => {
      taskDoesNotExistsHelper();
    });
  });

  describe("update", () => {
    it("should update a task when it exists", async () => {
      const updateTask = {
        ...mockTask,
        description: "Опустить руки",
        isCompleted: true,
      };

      const task = {
        description: "Опустить руки",
        isCompleted: true,
      };

      mockTasksRepository.findOneBy.mockResolvedValue(mockTask);
      mockTasksRepository.save.mockResolvedValue(updateTask);

      const result = await service.update(mockTask.id, task as UpdateTaskDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockTask.id });
      expect(repository.save).toHaveBeenCalledWith(updateTask);
      expect(result.description).toEqual(task.description);
      expect(result.isCompleted).toEqual(task.isCompleted);
    });

    it("should throw NotFoundException when task to update does not exist", async () => {
      taskDoesNotExistsHelper();
    });
  });

  describe("remove", () => {
    it("should remove a task when it exists", async () => {
      mockTasksRepository.findOneBy.mockResolvedValue(mockTask);

      await service.remove(mockTask.id);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: mockTask.id });
      expect(repository.remove).toHaveBeenCalledWith(mockTask);
      expect(repository.remove).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException when task to remove does not exist", async () => {
      taskDoesNotExistsHelper();
    });
  });
});
