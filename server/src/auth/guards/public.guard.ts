import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PublicGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('asdf')
    return true; // Always returns true, effectively making this endpoint public
  }
}
