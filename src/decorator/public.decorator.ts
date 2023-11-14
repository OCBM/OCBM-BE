import { SetMetadata } from '@nestjs/common';

import { DECORATOR_KEYS } from '@/common';

export const Public = () => SetMetadata(DECORATOR_KEYS.public, true);
