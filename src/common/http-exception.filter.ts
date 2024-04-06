// catch all http exception before send to the user

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import * as fs from 'fs';
import * as dayjs from 'dayjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message =
      typeof exception.getResponse() === 'string'
        ? exception.getResponse()
        : (exception.getResponse() as { message: string }).message;

    // level 1: log:
    new LoggerService().warn(request.url, 'ExceptionFilter');

    // level 2: write to file

    const messageLogging =
      '\n' +
      dayjs().format('DD-MM-YYYY HH:mm:ss A') +
      ' - ' +
      '[' +
      request.method +
      ']' +
      ' - ' +
      request.url +
      '';

    fs.appendFileSync('loggingSystem.txt', messageLogging);
    // fs.appendFileSync(
    //   'https://docs.google.com/document/d/1t_DyPR39WwFhE5pq7BLqHRmxDYuIrQMqx5bq1cNvgSg/edit?usp=sharing',
    //   messageLogging,
    // );

    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
