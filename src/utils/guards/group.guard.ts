import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GROUP_PERMISSIONS } from '@/common';
import { DECORATOR_KEYS } from '@/common';

@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      GROUP_PERMISSIONS[]
    >(DECORATOR_KEYS.groupPermission, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // assigning user group permissions
    const userPermission = new Set(request?.user?.group?.permissions);

    // with the required permission checking the user permission
    const isGrantPermission = requiredPermissions.some((permission) =>
      userPermission.has(permission),
    );

    return isGrantPermission;
  }
}
