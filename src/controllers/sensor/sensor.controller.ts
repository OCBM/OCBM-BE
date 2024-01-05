import {
  CreateSensorDto,
  SensorResponseDto,
  RolesGuard,
  UpdateSensorDto,
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
  HttpException,
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
import { SensorService } from '@/services/sensor/sensor.service';
import { Roles } from '@/decorator';
import { APP_CONSTANTS, Role, Sort, TABLES } from '@/common';
import { AwsService, PrismaService } from '@/services';
import { IsEnum } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Sensor')
@Controller('sensor')
export class SensorController {
  [x: string]: any;
  constructor(
    private readonly sensorService: SensorService,
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
        sensorId: {
          type: 'string',
        },
        sensorName: {
          type: 'string',
        },
        sensorDescription: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        elementId: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createSensor(
    @Body() sensorData: CreateSensorDto,
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
        ...sensorData,
        image,
        elements: {
          connect: {
            elementId: sensorData.elementId,
          },
        },
      };
      let element: any;
      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: data.elementId },
      });
      if (!element) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Element not Exists',
        };
      } else {
        delete data.elementId;
        const sensorCheck = await this.sensorService.checkSensor({
          sensorId: data.sensorId,
        });
        if (sensorCheck) {
          throw new HttpException(
            APP_CONSTANTS.SENSOR_ALREADY_EXISTS,
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const result = await this.sensorService.createSensor(data);
          return result;
        }
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
  async getAllSensors(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: Sort,
  ): Promise<SensorResponseDto> {
    return this.sensorService.getAllSensors(page, limit, sort);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  @Get('/elementId=:elementId')
  async getAllSensor(
    @Param('elementId', ParseUUIDPipe) elementId: string,
  ): Promise<SensorResponseDto> {
    return this.sensorService.getAllSensor(elementId);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  @ApiParam({
    name: 'sensorId',
    required: true,
  })
  @Get('/sensorId=:sensorId&elementId=:elementId')
  async getSensorByElementId(
    @Param('elementId', ParseUUIDPipe) elementId: string,
    @Param('sensorId') sensorId: string,
  ): Promise<SensorResponseDto> {
    return this.sensorService.getSensorByElementId(elementId, sensorId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  @ApiParam({
    name: 'sensorId',
    required: true,
  })
  @Put('/elementId=:elementId&sensorId=:sensorId')
  async updateSensor(
    @Body() sensorData: UpdateSensorDto,
    @Param('elementId', ParseUUIDPipe) elementId: string,
    @Param('sensorId') sensorId: string,
  ): Promise<SensorResponseDto> {
    return this.sensorService.updateSensor(elementId, sensorId, {
      ...sensorData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/elementId=:elementId&sensorId=:sensorId')
  @ApiParam({
    name: 'elementId',
    required: true,
  })
  @ApiParam({
    name: 'sensorId',
    required: true,
  })
  async deleteSensor(
    @Param('elementId', ParseUUIDPipe) elementId: string,
    @Param('sensorId') sensorId: string,
  ) {
    return this.sensorService.deleteSensor(elementId, sensorId);
  }
}
