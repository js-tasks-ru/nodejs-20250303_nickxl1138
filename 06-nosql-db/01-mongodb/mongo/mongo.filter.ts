import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode = HttpStatus.BAD_REQUEST;

    response.status(statusCode).json({
      error: "Bad Request",
      message: exception.message,
      statusCode: statusCode,
    });
  }
}
