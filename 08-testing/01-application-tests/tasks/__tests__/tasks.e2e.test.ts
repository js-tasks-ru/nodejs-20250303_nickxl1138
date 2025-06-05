import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../entities/task.entity";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  const tasks = [
    {
      id: 1,
      title: "Новое задание 1",
      description: "Взять себя в руки",
      isCompleted: false,
    },
    {
      id: 2,
      title: "Новое задание 2",
      description: "Опустить руки",
      isCompleted: true,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
    await repository.save(tasks);
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const response = await request(app.getHttpServer())
        .get("/tasks")
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(tasks[0]),
          expect.objectContaining(tasks[1]),
        ]),
      );
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return task by id", async () => {
      const response = await request(app.getHttpServer())
        .get("/tasks/1")
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining(tasks[0]));
    });

    it("should return 404 if task not found", async () => {
      await request(app.getHttpServer()).get("/tasks/999").expect(404);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const task = {
        title: "Новое задание 3",
        description: "Собраться с силами",
        isCompleted: true,
      };

      const response = await request(app.getHttpServer())
        .post("/tasks")
        .send(task)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: 3,
          ...task,
        }),
      );

      const tasks = await repository.find();
      expect(tasks).toHaveLength(3);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update an existing task", async () => {
      const update = {
        title: "Обновление 2",
        description: "преодолеть себя",
        isCompleted: true,
      };

      const response = await request(app.getHttpServer())
        .patch("/tasks/2")
        .send(update)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: 2,
          ...update,
        }),
      );

      const task = await repository.findOneBy({ id: 2 });
      expect(task).toEqual(
        expect.objectContaining({
          id: 2,
          ...update,
        }),
      );
    });

    it("should return 404 when updating non-existent task", async () => {
      const update = { title: "Non-existent Task" };
      await request(app.getHttpServer())
        .patch("/tasks/999")
        .send(update)
        .expect(404);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      await request(app.getHttpServer()).delete("/tasks/1").expect(200);

      const tasks = await repository.find();
      expect(tasks).toHaveLength(1);
    });

    it("should return 404 when deleting non-existent task", async () => {
      await request(app.getHttpServer()).delete("/tasks/999").expect(404);
    });
  });
});
