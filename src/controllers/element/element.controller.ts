import {
  CreateElementDto,
  ElementResponseDto,
  RolesGuard,
  UpdateElementDto,
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
import { ElementService } from '@/services/element/element.service';
import { Roles } from '@/decorator';
import { Role, TABLES } from '@/common';
import { PrismaService } from '@/services';

@ApiTags('Element')
@Controller('element')
export class ElementController {
  [x: string]: any;
  constructor(
    private readonly elementService: ElementService,
    private readonly prismaDynamic: PrismaService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  async createElement(@Body() elementData: CreateElementDto) {
    const data = {
      ...elementData,
      machines: {
        connect: {
          machineId: elementData.machineId,
        },
      },
    };
    let machine: any;
    machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
      where: { machineId: data.machineId },
    });
    if (!machine) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        Error: 'Machine not Exists',
      };
    } else {
      delete data.machineId;
      const result = await this.elementService.createElement(data);
      return result;
    }
  }

  @ApiBearerAuth('access-token')
  @Get('/')
  async getAllElements(): Promise<ElementResponseDto> {
    return this.elementService.getAllElements();
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  @Get('/machineId=:machineId')
  async getAllElement(
    @Param('machineId', ParseUUIDPipe) machineId: string,
  ): Promise<ElementResponseDto> {
    return this.elementService.getAllElement(machineId);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  @Get('/elementId=:elementId&machineId=:machineId')
  async getElementByMachineId(
    @Param('machineId', ParseUUIDPipe) machineId: string,
    @Param('elementId', ParseUUIDPipe) elementId: string,
  ): Promise<ElementResponseDto> {
    return this.elementService.getElementByMachineId(machineId, elementId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  @Put('/machineId=:machineId&elementId=:elementId')
  async updateElement(
    @Body() elementData: UpdateElementDto,
    @Param('machineId', ParseUUIDPipe) machineId: string,
    @Param('elementId', ParseUUIDPipe) elementId: string,
  ): Promise<ElementResponseDto> {
    return this.elementService.updateElement(machineId, elementId, {
      ...elementData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/machineId=:machineId&elementId=:elementId')
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  async deleteElement(
    @Param('machineId', ParseUUIDPipe) machineId: string,
    @Param('elementId', ParseUUIDPipe) elementId: string,
  ) {
    return this.elementService.deleteElement(machineId, elementId);
  }
}
