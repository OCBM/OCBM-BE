import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, Role } from '@/common';

export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);
