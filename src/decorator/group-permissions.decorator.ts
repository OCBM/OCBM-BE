import { SetMetadata } from '@nestjs/common';
import { GROUP_PERMISSIONS, GROUP_PERMISSIONS_KEY } from '@/common';

export const GroupPermission = (...args: GROUP_PERMISSIONS[]) =>
  SetMetadata(GROUP_PERMISSIONS_KEY, args);
