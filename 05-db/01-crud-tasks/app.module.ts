import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule } from "@nestjs/config";
import database from "./config/database";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [database] }),
    TypeOrmModule.forRootAsync(database.asProvider()),
    TasksModule,
  ],
})
export class AppModule {}
