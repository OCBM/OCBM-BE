import { Module, Global } from '@nestjs/common';
//import { PrismaDynamicQueries, PrismaService } from '@/services';
import { PrismaService } from '@/services';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
