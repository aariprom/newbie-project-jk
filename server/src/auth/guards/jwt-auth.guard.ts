import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const path = request.url;

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic || path === '/auth/login' || path === '/auth/refresh' || path === '/auth/authCheck') {
      return true;
    }

    return super.canActivate(context);  // Proceed with the regular JwtAuthGuard logic
  }
}