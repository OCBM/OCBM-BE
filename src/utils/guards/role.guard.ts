import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@/common/enum';
import { APP_CONSTANTS, DECORATOR_KEYS } from '@/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      DECORATOR_KEYS.roles,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const havPermission = requiredRoles.some(
      (role) => role === request?.user?.role,
    );
    if (havPermission) {
      return true;
    } else {
      throw new HttpException(
        APP_CONSTANTS.PERMISSION_DENIED,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
