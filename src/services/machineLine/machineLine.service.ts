import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MachineLineResponseDto, UpdateMachineLineDto } from '@/utils';
import { PrismaValidation, TABLES, APP_CONSTANTS } from '@/common';

@Injectable()
export class MachineLineService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async createMachineLine(
    data: Prisma.MachineLineCreateInput,
  ): Promise<MachineLineResponseDto> {
    try {
      const machineLine = await this.prismaDynamic.create(
        TABLES.MACHINELINE,
        data,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: machineLine,
      };
    } catch (error) {
      console.log(error);
      if (error.response.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          APP_CONSTANTS.MACHINELINE_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_MACHINELINE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMachineLine(
    page: number,
    limit: number,
    sort: string,
  ): Promise<MachineLineResponseDto> {
    try {
      const machineLine = await this.prismaDynamic.findMany(
        TABLES.MACHINELINE,
        {
          orderBy: [
            {
              createdAt: sort,
            },
          ],
          skip: (page - 1) * limit,
          take: limit,
        },
      );
      if (machineLine.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: machineLine,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.THERE_IS_NO_MACHINELINE,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_MACHINELINES,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllMachineLines(shopId: any): Promise<MachineLineResponseDto> {
    try {
      const shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });
      if (!shop) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_SHOP,
        };
      }
      const machineLine = await this.prismaDynamic.findMany(
        TABLES.MACHINELINE,
        {
          where: { shopId: shop.shopId },
        },
      );
      if (machineLine.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: machineLine,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.THERE_IS_NO_MACHINELINE_IN_THIS_SHOP,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_MACHINELINES,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMachineLineByShopId(
    shopId: string,
    machineLineId: string,
  ): Promise<MachineLineResponseDto> {
    let machineLine: any;

    let shop: any;

    try {
      shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });

      const checkmachineLine = await this.prismaDynamic.findUnique(
        TABLES.MACHINELINE,
        {
          where: {
            machineLineId: machineLineId,
          },
        },
      );
      machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
        where: {
          machineLineId: machineLineId,
          shopId: shop.shopId,
        },
      });

      if (machineLine) {
        return machineLine;
      } else if (
        checkmachineLine &&
        checkmachineLine?.shopId !== shop?.shopId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.SHOP_AND_MACHINELINE_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_MACHINELINE,
        };
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.MACHINELIONE_AND_SHOP_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateMachineLine(
    shopId: string,
    machineLineId: string,
    data: UpdateMachineLineDto,
  ): Promise<MachineLineResponseDto> {
    try {
      let machineLine: any;
      let shop: any;
      shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId: shopId },
      });

      const checkmachineLine = await this.prismaDynamic.findUnique(
        TABLES.MACHINELINE,
        {
          where: { machineLineId: machineLineId },
        },
      );
      machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
        where: {
          machineLineId: machineLineId,
          shopId: shop.shopId,
        },
      });
      if (machineLine) {
        const updatedData = await this.prismaDynamic.update(
          TABLES.MACHINELINE,
          {
            where: { machineLineId: machineLineId },
            data,
          },
        );

        return new MachineLineResponseDto({
          statusCode: HttpStatus.OK,
          message: updatedData,
        });
      } else if (
        checkmachineLine &&
        checkmachineLine?.shopId !== shop?.shopId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.SHOP_AND_MACHINELINE_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_MACHINELINE,
        };
      }
    } catch (error) {
      throw new HttpException(
        APP_CONSTANTS.SHOP_AND_MACHINELINE_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteMachineLine(shopId: string, machineLineId: string) {
    try {
      let machineLine: any;
      let shop: any;
      shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
        where: { shopId },
      });

      const checkmachineLine = await this.prismaDynamic.findUnique(
        TABLES.MACHINELINE,
        {
          where: { machineLineId: machineLineId },
        },
      );

      machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
        where: {
          machineLineId: machineLineId,
          shopId: shop.shopId,
        },
      });

      if (machineLine) {
        await this.prismaDynamic.delete(TABLES.MACHINELINE, {
          where: {
            machineLineId: machineLine.machineLineId,
            shopId: shop?.shopId,
          },
        });
        return {
          statusCode: HttpStatus.OK,
          message: APP_CONSTANTS.MACHINELINE_DELETED_SUCCESSFULLY,
        };
      } else if (
        checkmachineLine &&
        shop &&
        checkmachineLine?.shopId !== shop?.shopId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.SHOP_AND_MACHINELINE_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_MACHINELINE,
        };
      }
    } catch (error) {
      if (error.response.code === PrismaValidation.FOREIGN_KEY) {
        throw new HttpException(
          APP_CONSTANTS.UNABLE_TO_DELETE_MACHINELINE,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          APP_CONSTANTS.SHOP_AND_MACHINELINE_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
