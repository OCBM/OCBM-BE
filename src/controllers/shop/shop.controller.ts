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
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ShopService } from '@/services/shop/shop.service';
import { Roles } from '@/decorator';
import { Role, TABLES } from '@/common';
import { PrismaService } from '@/services';

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
  @ApiParam({
    name: 'plantId',
    required: true,
  })
  @Get('/:plantId')
  async getAllShops(
    @Param('plantId', ParseUUIDPipe) plantId: string,
  ): Promise<ShopResponseDto> {
    return this.shopService.getAllShops(plantId);
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
  @Get('/:plantId/:shopId')
  async getShopByPlantId(
    @Param('plantId', ParseUUIDPipe) plantId: string,
    @Param('shopId', ParseUUIDPipe) shopId: string,
  ): Promise<ShopResponseDto> {
    return this.shopService.getShopByPlantId(plantId, shopId);
  }
  //   @ApiParam({
  //     name: 'userId',
  //     required: true,
  //   })
  //   @ApiParam({
  //     name: 'plantId',
  //     required: true,
  //   })
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
    name: 'plantId',
    required: true,
  })
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @Put('/:plantId/:shopId')
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
  @Delete('/:plantId/:shopId')
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
