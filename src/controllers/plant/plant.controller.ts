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
  UploadedFile,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { PlantService } from '@/services/plant/plant.service';
import { Public, Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { AwsService, PrismaService } from '@/services';
import { IsEnum } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Plant')
@Controller('plant')
export class PlantController {
  [x: string]: any;
  constructor(
    private readonly plantService: PlantService,
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
      required: [
        'plantName',
        'description',
        'imageName',
        'organizationId',
        'image',
      ],
      properties: {
        plantName: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        organizationId: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createPlant(
    @Body() plantData: CreatePlantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // const { originalname } = file;
      // const randomNumber = Math.floor(1000 + Math.random() * 9000);
      // //console.log('plants'+ '/' + originalname)
      // const checkImageKey = 'plants' + '/' + randomNumber + '_' + originalname;
      // const checkImage = await this.prismaDynamic.findUnique(TABLES.PLANT, {
      //   where: { imageKey: checkImageKey },
      // });
      //if (!checkImage) {
      const imageData = await this.awsService.uploadFile(file, 'plants');
      if (!imageData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Unable to upload image',
        };
      }
      const image = imageData.Location;
      const imageKey = imageData.Key;
      const data = {
        ...plantData,
        image,
        imageKey,
        organization: {
          connect: {
            organizationId: plantData.organizationId,
          },
        },
      };
      const organization: any = await this.prismaDynamic.findUnique(
        TABLES.ORGANIZATION,
        {
          where: { organizationId: data.organizationId },
        },
      );
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
      // }
      //  else {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Image Already exists',
      //   };
      // }
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        plantName: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('/organizationId=:organizationId&plantId=:plantId')
  async updatePlant(
    @Body() plantData: UpdatePlantDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ): Promise<PlantResponseDto> {
    try {
      if (file) {
        // const { originalname } = file;
        // const randomNumber = Math.floor(1000 + Math.random() * 9000);
        // //console.log('plants'+ '/' + originalname)
        // const checkImageKey =
        //   'plants' + '/' + randomNumber + '_' + originalname;
        // const checkImage = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        //   where: { imageKey: checkImageKey },
        // });
        // if (!checkImage) {
        const imageData = await this.awsService.uploadFile(file, 'plants');

        if (!imageData) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            Error: 'Unable to upload image',
          };
        }
        plantData.image = imageData.Location;
        plantData.imageKey = imageData.Key;
        if (plantData.image && plantData.imageKey) {
          const plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
            where: {
              plantId: plantId,
              organizationId: organizationId,
            },
          });
          const result = plant.imageKey;
          if (result) {
            await this.awsService.deleteFile(result);
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              Error: 'Unable to fetch image-data from the Database',
            };
          }
        }
      }
      return this.plantService.updatePlant(organizationId, plantId, {
        ...plantData,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
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
    const plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
      where: {
        plantId: plantId,
        organizationId: organizationId,
      },
    });
    if (plant) {
      await this.awsService.deleteFile(plant.imageKey);
      return this.plantService.deletePlant(organizationId, plantId);
    } else {
      throw new HttpException(
        'Unable to delete due to plant not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/test-upload-file')
  async testUpload(@UploadedFile() file: Express.Multer.File) {
    const imageData = await this.awsService.uploadFile(file, 'plants');
    return imageData;
  }
}
