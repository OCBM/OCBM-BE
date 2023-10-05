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
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PlantService } from '@/services/plant/plant.service';
import { Roles } from '@/decorator';
import { Role } from '@/common';

@ApiTags('Plant')
@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/create')
  async createPlant(@Body() plantData: CreatePlantDto) {
    const result = await this.plantService.createPlant({
      ...plantData,
    });
    return result;
  }
  @ApiBearerAuth('access-token')
  @Get('/get-all-plants')
  async getAllPlants(plant): Promise<PlantResponseDto> {
    return this.plantService.getAllPlants(plant);
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth('access-token')
  @Get('/:id')
  async getPlantById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.getPlantById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Put('/:id')
  async updatePlant(
    @Body() plantData: UpdatePlantDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PlantResponseDto> {
    return this.plantService.updatePlant(id, {
      ...plantData,
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
  async deletePlant(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantService.deletePlant(id);
  }
}
