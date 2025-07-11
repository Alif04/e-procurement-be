import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

interface BadRequestResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as BadRequestResponse;
    const errors = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : [exceptionResponse.message];

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
