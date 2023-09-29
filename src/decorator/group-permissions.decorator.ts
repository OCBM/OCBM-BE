import { SetMetadata } from '@nestjs/common';
import { GROUP_PERMISSIONS, DECORATOR_KEYS } from '@/common';

export const GroupPermission = (...args: GROUP_PERMISSIONS[]) =>
  SetMetadata(DECORATOR_KEYS.groupPermission, args);
