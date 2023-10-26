import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ShopResponseDto, UpdateShopDto } from '@/utils';
import { PrismaValidation, TABLES } from '@/common';

@Injectable()
export class ShopService {
  constructor(private readonly prismaDynamic: PrismaService) {}

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
        throw new HttpException('Shop already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to create shop',
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
          Error: 'There no Plant',
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
          Error: 'There is no shop in this plant',
        };
      }
    } catch (e) {
      throw new HttpException('unable to fetch shops', HttpStatus.BAD_REQUEST);
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
          Error: 'There is no shop',
        };
      }
    } catch (e) {
      throw new HttpException('unable to fetch shops', HttpStatus.BAD_REQUEST);
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
      // if (!organization) {
      //   // throw new HttpException('Invalid Organization', HttpStatus.BAD_REQUEST);
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     message: organization,
      //   };
      // }
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

      //   console.log(plant, shop, checkShop);
      if (shop) {
        return shop;
      } else if (checkShop && checkShop?.plantId !== plant?.plantId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Plant and Shop is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no shop',
        };
        // throw new HttpException(
        //   'Organazation and Plant is mismatching',
        //   HttpStatus.BAD_REQUEST,
        // );
      }
    } catch {
      throw new HttpException('Plant/Shop not exists', HttpStatus.BAD_REQUEST);
    }
  }
  // async getPlantByUserId(
  //   userId: string,
  //   plantid: string,
  // ): Promise<PlantResponseDto> {
  //   let plant: any;

  //   let user: any;

  //   try {
  //     user = await this.prismaDynamic.findUnique(TABLES.USER, {
  //       where: { UserId: userId },
  //     });

  //     if (!user) {
  //       throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
  //     } else {
  //       plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
  //         where: { plantId: plantid },
  //       });
  //     }
  //   } catch {
  //     throw new HttpException(
  //       'Organazation/Plant not exists',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return {
  //     statusCode: HttpStatus.OK,

  //     message: plant,
  //   };
  // }

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
      // if (!organization) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Organization not exist',
      //   };
      // }
      const checkShop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });
      // if (!checkPlant) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Plant not exist',
      //   };
      // }

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
          Error: 'Plant and Shop is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no shop',
        };
      }
    } catch (error) {
      throw new HttpException('Plant/Shop not exists', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteShop(plantId: string, shopId: string) {
    try {
      let shop: any;
      let plant: any;
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId },
      });
      // if (!organization) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Organization not Exists',
      //   };
      // }
      const checkShop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });
      // if (!plant) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Plant not Exists',
      //   };
      // }
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
          message: 'Shop deleted successfully',
        };
      } else if (checkShop && plant && checkShop?.plantId !== plant?.plantId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Plant and shop is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no shop',
        };
      }
    } catch (error) {
      throw new HttpException('Plant/Shop not exists', HttpStatus.BAD_REQUEST);
    }
  }
}
