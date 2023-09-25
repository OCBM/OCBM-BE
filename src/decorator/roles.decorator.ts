import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, ROLES_KEY, Role } from '@/common';

export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
