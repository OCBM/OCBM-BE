import { SetMetadata } from '@nestjs/common';
import { Role } from '@/common/enum';

export const ROLES_KEY = 'roles';
export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
