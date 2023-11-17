import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ShopResponseDto, UpdateShopDto } from '@/utils';
import { PrismaValidation, TABLES, APP_CONSTANTS } from '@/common';

@Injectable()
export class ShopService {
  constructor(private readonly prismaDynamic: PrismaService) { }

  async createShop(data: Prisma.ShopCreateInput): Promise<ShopResponseDto> {
    try {
      const shop = await this.prismaDynamic.create(TABLES.SHOP, data);
      return {
        statusCode: HttpStatus.CREATED,
        message: shop,
      };
    } catch (error) {
      console.log(error);
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(APP_CONSTANTS.SHOP_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_SHOP,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllShopsByPlantId(plantId: any): Promise<ShopResponseDto> {
    try {
      const plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
      });
      if (!plant) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_NO_PLANT,
        };
      }
      const shops = await this.prismaDynamic.findMany(TABLES.SHOP, {
        where: { plantId: plant.plantId },
      });
      if (shops.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: shops,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.THERE_IS_NO_SHOP_IN_THIS_PLANT,
        };
      }
    } catch (e) {
      throw new HttpException(APP_CONSTANTS.UNABLE_TO_FETCH_SHOPS, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllShops(): Promise<ShopResponseDto> {
    try {
      const shops = await this.prismaDynamic.findMany(TABLES.SHOP, {});
      if (shops.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: shops,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.THERE_IS_NO_SHOP,
        };
      }
    } catch (e) {
      throw new HttpException(APP_CONSTANTS.UNABLE_TO_FETCH_SHOPS, HttpStatus.BAD_REQUEST);
    }
  }

  async getShopByPlantId(
    plantId: string,
    shopId: string,
  ): Promise<ShopResponseDto> {
    let shop: any;

    let plant: any;

    try {
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
      });

      const checkShop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: {
          shopId: shopId,
        },
      });
      shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: {
          shopId: shopId,
          plantId: plant.plantId,
        },
      });

      if (shop) {
        return shop;
      } else if (checkShop && checkShop?.plantId !== plant?.plantId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.PLANT_AND_SHOP_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_SHOP,
        };
      }
    } catch {
      throw new HttpException(APP_CONSTANTS.PLANT_AND_SHOP_NOT_EXISTS, HttpStatus.BAD_REQUEST);
    }
  }

  async updateShop(
    plantId: string,
    shopId: string,
    data: UpdateShopDto,
  ): Promise<ShopResponseDto> {
    try {
      let shop: any;
      let plant: any;
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
      });

      const checkShop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });
      shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: {
          shopId: shopId,
          plantId: plant.plantId,
        },
      });
      if (shop) {
        const updatedData = await this.prismaDynamic.update(TABLES.SHOP, {
          where: { shopId: shopId },
          data,
        });

        return new ShopResponseDto({
          statusCode: HttpStatus.OK,
          message: updatedData,
        });
      } else if (checkShop && checkShop?.plantId !== plant?.plantId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.PLANT_AND_SHOP_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_SHOP,
        };
      }
    } catch (error) {
      throw new HttpException(APP_CONSTANTS.PLANT_AND_SHOP_NOT_EXISTS, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteShop(plantId: string, shopId: string) {
    try {
      let shop: any;
      let plant: any;
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId },
      });

      const checkShop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });

      shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: {
          shopId: shopId,
          plantId: plant.plantId,
        },
      });

      if (shop) {
        await this.prismaDynamic.delete(TABLES.SHOP, {
          where: {
            shopId: shop.shopId,
            plantId: plant?.plantId,
          },
        });
        return {
          statusCode: HttpStatus.OK,
          message: APP_CONSTANTS.SHOP_DELETED_SUCCESSFULLY,
        };
      } else if (checkShop && plant && checkShop?.plantId !== plant?.plantId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.PLANT_AND_SHOP_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_SHOP,
        };
      }
    } catch (error) {
      if(error.response.code === PrismaValidation.FOREIGN_KEY){
        throw new HttpException(
          APP_CONSTANTS.UNABLETODELETE,
          HttpStatus.BAD_REQUEST,
        );
      } 
      else{
      throw new HttpException(APP_CONSTANTS.PLANT_AND_SHOP_NOT_EXISTS, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
