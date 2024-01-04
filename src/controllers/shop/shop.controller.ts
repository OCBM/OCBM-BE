import {
  CreateShopDto,
  ShopResponseDto,
  RolesGuard,
  UpdateShopDto,
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ShopService } from '@/services/shop/shop.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { AwsService, PrismaService } from '@/services';
import { IsEnum } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  [x: string]: any;
  constructor(
    private readonly shopService: ShopService,
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
        shopName: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        plantId: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createShop(
    @Body() shopData: CreateShopDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imageData = await this.awsService.uploadFile(file, 'shops');
      if (!imageData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Unable to upload image',
        };
      }
      const image = imageData.Location;
      const data = {
        ...shopData,
        image,
        plant: {
          connect: {
            plantId: shopData.plantId,
          },
        },
      };
      let plant: any;
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: data.plantId },
      });
      if (!plant) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Plant not Exists',
        };
      } else {
        delete data.plantId;
        const result = await this.shopService.createShop(data);
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
  async getAllShops(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: Sort,
  ): Promise<ShopResponseDto> {
    return this.shopService.getAllShops(page, limit, sort);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @Get('/plantId=:plantId')
  async getAllShopsByPlantId(
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ): Promise<ShopResponseDto> {
    return this.shopService.getAllShopsByPlantId(plantId);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @Get('/shopId=:shopId&plantId=:plantId')
  async getShopByPlantId(
    @Param('plantId', ParseUUIDPipe) plantId: string,
    @Param('shopId', ParseUUIDPipe) shopId: string,
  ): Promise<ShopResponseDto> {
    return this.shopService.getShopByPlantId(plantId, shopId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @Put('/plantId=:plantId&shopId=:shopId')
  async updateShop(
    @Body() shopData: UpdateShopDto,
    @Param('plantId', ParseUUIDPipe) plantId: string,
    @Param('shopId', ParseUUIDPipe) shopId: string,
  ): Promise<ShopResponseDto> {
    return this.shopService.updateShop(plantId, shopId, {
      ...shopData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/plantId=:plantId&shopId=:shopId')
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  async deleteShop(
    @Param('plantId', ParseUUIDPipe) plantId: string,
    @Param('shopId', ParseUUIDPipe) shopId: string,
  ) {
    return this.shopService.deleteShop(plantId, shopId);
  }
}
