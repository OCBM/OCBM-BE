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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PlantService } from '@/services/plant/plant.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { PrismaService } from '@/services';
import { IsEnum } from 'class-validator';

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
  @ApiQuery({
    name: 'sort',
    enum: Sort,
    required: true,
  })
  @IsEnum(Sort)
  @Get('/')
  async getAllPlants(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: Sort,
  ): Promise<PlantResponseDto> {
    return this.plantService.getAllPlants(page, limit, sort);
  }


  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'organizationId',
    required: true,
  })
  @Get('/organizationId=:organizationId')
  async getAllPlantsByOrganization(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.getAllPlantsByOrganization(organizationId);
  }
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'userId',
    required: true,
  })
  @Get('/userId=:userId')
  async getAllPlantsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.getAllPlantsByUser(userId);
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
  @Get('/plantId=:plantId&organizationId=:organizationId')
  async getPlantByOrganizationId(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.getPlantByOrganizationId(organizationId, plantId);
  }
  
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
  @Put('/organizationId=:organizationId&plantId=:plantId')
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
  @Delete('/organizationId=:organizationId&plantId=:plantId')
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
