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
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ShopService } from '@/services/shop/shop.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { PrismaService } from '@/services';
import { IsEnum } from 'class-validator';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  [x: string]: any;
  constructor(
    private readonly shopService: ShopService,
    private readonly prismaDynamic: PrismaService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  async createShop(@Body() shopData: CreateShopDto) {
    const data = {
      ...shopData,
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
