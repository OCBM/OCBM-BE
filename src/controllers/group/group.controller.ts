import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common';
import { Roles } from '@/decorator';
import { GroupService } from '@/services';
import {
  RolesGuard,
  CreateGroupDto,
  UpdateGroupDto,
  GroupResponseDto,
  GroupsResponseDto,
} from '@/utils';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @ApiBearerAuth('access-token')
  @Get('/')
  async getAllGroups(): Promise<GroupsResponseDto> {
    return this.groupService.getAllGroups();
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async getGroupById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GroupResponseDto> {
    return this.groupService.getGroupById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  async createGroup(@Body() groupData: CreateGroupDto) {
    const result = await this.groupService.createGroup(groupData);
    return result;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Put('/:id')
  async updateGroup(
    @Body() groupData: UpdateGroupDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GroupResponseDto> {
    return this.groupService.updateGroup(id, groupData);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async deleteGroup(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupService.deleteGroup(id);
  }
}
