// common-response.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiCommonErrorResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 404,
      description: 'Not found.',
    })
  );
};