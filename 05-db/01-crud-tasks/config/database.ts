import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs("database", () => {
  return {
    type: "sqlite",
    database: "./db.sqlite",
    autoLoadEntities: true,
    synchronize: true,
  } as TypeOrmModuleOptions;
});
