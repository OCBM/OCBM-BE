import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@/services';
import { PrismaDynamicQueries } from '@/utils/dynamicQueries/PrismaDynamicQueries';

@Global()
@Module({
  providers: [PrismaService, PrismaDynamicQueries],
  exports: [PrismaService, PrismaDynamicQueries],
})
export class PrismaModule {}
