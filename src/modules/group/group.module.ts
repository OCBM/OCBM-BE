import { GroupController } from '@/controllers';
import { GroupService } from '@/services';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
