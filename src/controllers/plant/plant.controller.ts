import {
  CreatePlantDto,
  PlantResponseDto,
  RolesGuard,
  UpdatePlantDto,
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
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PlantService } from '@/services/plant/plant.service';
import { Roles } from '@/decorator';
import { Role, TABLES } from '@/common';
import { PrismaService } from '@/services';

@ApiTags('Plant')
@Controller('plant')
export class PlantController {
  [x: string]: any;
  constructor(
    private readonly plantService: PlantService,
    private readonly prismaDynamic: PrismaService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  async createPlant(@Body() plantData: CreatePlantDto) {
    const data = {
      ...plantData,
      organization: {
        connect: {
          organizationId: plantData.organizationId,
        },
      },
    };
    let organization: any;
    organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
      where: { organizationId: data.organizationId },
    });
    if (!organization) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        Error: 'Organization not Exists',
      };
    } else {
      delete data.organizationId;
      const result = await this.plantService.createPlant(data);
      return result;
    }
  }
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'organizationId',
    required: true,
  })
  @Get('/:organizationId')
  async getAllPlants(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.getAllPlants(organizationId);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'organizationId',
    required: true,
  })
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @Get('/:organizationId/:plantId')
  async getPlantByOrganizationId(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.getPlantByOrganizationId(organizationId, plantId);
  }
  // @ApiParam({
  //   name: 'userId',
  //   required: true,
  // })
  // @ApiParam({
  //   name: 'plantId',
  //   required: true,
  // })
  // @ApiBearerAuth('access-token')
  // @Get('/:userId/:plantId')
  // async getPlantByUserId(
  //   @Param('userId', ParseUUIDPipe) userId: string,
  //   @Param('plantId', ParseUUIDPipe) plantId: string,
  // ): Promise<PlantResponseDto> {
  //   return this.plantService.getPlantByUserId(userId, plantId);
  // }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'organizationId',
    required: true,
  })
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @Put('/:organizationId/:plantId')
  async updatePlant(
    @Body() plantData: UpdatePlantDto,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.updatePlant(organizationId, plantId, {
      ...plantData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/:organizationId/:plantId')
  @ApiParam({
    name: 'organizationId',
    required: true,
  })
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  async deletePlant(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ) {
    return this.plantService.deletePlant(organizationId, plantId);
  }
}
