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
  ParseIntPipe,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ElementService } from '@/services/element/element.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { AwsService, PrismaService } from '@/services';
import { IsEnum } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Element')
@Controller('element')
export class ElementController {
  [x: string]: any;
  constructor(
    private readonly elementService: ElementService,
    private readonly prismaDynamic: PrismaService,
    private readonly awsService: AwsService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        elementName: {
          type: 'string',
        },
        elementDescription: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        machineId: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createElement(
    @Body() elementData: CreateElementDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imageData = await this.awsService.uploadFile(file, 'elements');
      if (!imageData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Unable to upload image',
        };
      }
      const image = imageData.Location;
      const data = {
        ...elementData,
        image,
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
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        Error: 'Unable to upload image',
      };
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
  async getAllElements(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: Sort,
  ): Promise<ElementResponseDto> {
    return this.elementService.getAllElements(page, limit, sort);
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
