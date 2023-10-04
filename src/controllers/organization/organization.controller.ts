import {
  CreateOrganizationDto,
  OrganizationResponseDto,
  RolesGuard,
  UpdateOrganizationDto,
} from '@/utils';
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from '@/services';
import { Roles } from '@/decorator';
import { Role } from '@/common';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/create')
  async createOrganization(@Body() organizationData: CreateOrganizationDto) {
    const result = await this.organizationService.createOrganization({
      ...organizationData,
    });
    return result;
  }
  @ApiBearerAuth('access-token')
  @Get('/get-all-organization')
  async getAllOrganization(organization): Promise<OrganizationResponseDto> {
    return this.organizationService.getAllOrganization(organization);
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth('access-token')
  @Get('/:id')
  async getOrganizationById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrganizationResponseDto> {
    return this.organizationService.getOrganizationById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Put('/:id')
  async updateOrganization(
    @Body() organizationData: UpdateOrganizationDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrganizationResponseDto> {
    return this.organizationService.updateOrganization(id, {
      ...organizationData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async deleteOrganization(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationService.deleteOrganization(id);
  }
}
