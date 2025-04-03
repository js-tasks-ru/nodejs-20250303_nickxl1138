import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { appendFileSync } from "fs";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message;
    const timestamp = new Date().toISOString();

    appendFileSync("errors.log", `[${timestamp}] ${statusCode} - ${message}\n`);

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      timestamp: timestamp,
    });
  }
}
