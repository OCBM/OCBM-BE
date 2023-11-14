import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MachineLineResponseDto, UpdateMachineLineDto } from '@/utils';
import { PrismaValidation, TABLES } from '@/common';

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
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          'MachineLine already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create machineLine',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMachineLine(): Promise<MachineLineResponseDto> {
    try {
      const machineLine = await this.prismaDynamic.findMany(
        TABLES.MACHINELINE,
        {},
      );
      if (machineLine.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: machineLine,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: 'There is no MachineLine',
        };
      }
    } catch (e) {
      throw new HttpException(
        'unable to fetch MachineLines',
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
          Error: 'There no Shop',
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
          Error: 'There is no MachineLines in this Shop',
        };
      }
    } catch (e) {
      throw new HttpException(
        'unable to fetch machineLine',
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
          Error: 'Shop and machineLine is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no machineLine',
        };
      }
    } catch {
      throw new HttpException(
        'MachineLine/Shop not exists',
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
          Error: 'Shop and MachineLine is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no machineLine',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Shop/MachineLine not exists',
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
          message: 'MachineLine deleted successfully',
        };
      } else if (
        checkmachineLine &&
        shop &&
        checkmachineLine?.shopId !== shop?.shopId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Shop and MachineLine is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no MachineLine',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Shop/MachineLine not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
