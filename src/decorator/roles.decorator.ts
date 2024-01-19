import { SetMetadata } from '@nestjs/common';
import { DECORATOR_KEYS, Role } from '@/common';

export const Roles = (...args: Role[]) =>
  SetMetadata(DECORATOR_KEYS.roles, args);
