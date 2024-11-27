import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /*handleRequest(err, user, info, context, status) {
    const request = context.switchToHttp().getRequest();
    const { id, password } = request.body;
    if (err || !user) {
      if (!id || !password) {
        throw new HttpException({ message: 'Invalid id or password.'}, HttpStatus.UNAUTHORIZED);
      } else {
        throw err || new UnauthorizedException();
      }
    }
    return user;
  }*/
}