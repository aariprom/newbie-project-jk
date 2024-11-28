import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof Prisma.PrismaClientKnownRequestError ? 400 : 500;

    let message = 'An error occurred while handling database operation: ';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific error codes from Prisma
      if (exception.code === 'P2002') {
        message += 'Unique constraint failed.';
      } else if (exception.code === 'P2003') {
        message += 'Foreign key constraint failed.';
      } else {
        message += 'Bad request for accessing prisma database.'
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      message += 'Validation failed.';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
