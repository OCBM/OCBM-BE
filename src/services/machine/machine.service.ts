import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MachineResponseDto, UpdateMachineDto } from '@/utils';
import { APP_CONSTANTS, PrismaValidation, TABLES } from '@/common';

@Injectable()
export class MachineService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async createMachine(
    data: Prisma.MachineCreateInput,
  ): Promise<MachineResponseDto> {
    try {
      const machine = await this.prismaDynamic.create(TABLES.MACHINE, data);
      return {
        statusCode: HttpStatus.CREATED,
        message: machine,
      };
    } catch (error) {
      console.log(error);
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          APP_CONSTANTS.MACHINE_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_MACHINE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMachines(): Promise<MachineResponseDto> {
    try {
      const machine = await this.prismaDynamic.findMany(TABLES.MACHINE, {});
      if (machine.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: machine,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_MACHINE,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_MACHINE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAllMachine(machineLineId: any): Promise<MachineResponseDto> {
    try {
      const machineLine = await this.prismaDynamic.findUnique(
        TABLES.MACHINELINE,
        {
          where: { machineLineId: machineLineId },
        },
      );
      if (!machineLine) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_MACHINELINE,
        };
      }
      const machine = await this.prismaDynamic.findMany(TABLES.MACHINE, {
        where: { machineLineId: machineLine.machineLineId },
      });
      if (machine.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: machine,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_MACHINE_IN_THIS_MACHINELINE,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_MACHINE,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMachineBymachineLineId(
    machineLineId: string,
    machineId: string,
  ): Promise<MachineResponseDto> {
    let machine: any;

    let machineLine: any;

    try {
      machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
        where: { machineLineId: machineLineId },
      });

      const checkmachine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: {
          machineId: machineId,
        },
      });
      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: {
          machineId: machineId,
          machineLineId: machineLine.machineLineId,
        },
      });

      if (machine) {
        return machine;
      } else if (
        checkmachine &&
        checkmachine?.machineLineId !== machineLine?.machineLineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.MACHINE_AND_MACHINELINE_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_MACHINE,
        };
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.MACHINE_OR_MACHINELINE_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateMachine(
    machineLineId: string,
    machineId: string,
    data: UpdateMachineDto,
  ): Promise<MachineResponseDto> {
    try {
      let machine: any;
      let machineLine: any;
      machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
        where: { machineLineId: machineLineId },
      });

      const checkmachine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });
      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: {
          machineId: machineId,
          machineLineId: machineLine.machineLineId,
        },
      });
      if (machine) {
        const updatedData = await this.prismaDynamic.update(TABLES.MACHINE, {
          where: { machineId: machineId },
          data,
        });

        return new MachineResponseDto({
          statusCode: HttpStatus.OK,
          message: updatedData,
        });
      } else if (
        checkmachine &&
        checkmachine?.machineLineId !== machineLine?.machineLineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.MACHINE_AND_MACHINELINE_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_MACHINE,
        };
      }
    } catch (error) {
      throw new HttpException(
        APP_CONSTANTS.MACHINE_OR_MACHINELINE_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteMachine(machineLineId: string, machineId: string) {
    try {
      let machine: any;
      let machineLine: any;
      machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
        where: { machineLineId },
      });

      const checkmachine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });

      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: {
          machineId: machineId,
          machineLineId: machineLine.machineLineId,
        },
      });

      if (machine) {
        await this.prismaDynamic.delete(TABLES.MACHINE, {
          where: {
            machineId: machine.machineId,
            machineLineId: machineLine?.machineLineId,
          },
        });
        return {
          statusCode: HttpStatus.OK,
          message: APP_CONSTANTS.MACHINE_DELEATED_SUCCESSFULLY,
        };
      } else if (
        checkmachine &&
        machineLine &&
        checkmachine?.machineLineId !== machineLine?.machineLineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.MACHINE_AND_MACHINELINE_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_MACHINE,
        };
      }
    } catch (error) {
      if (error.response.code === PrismaValidation.FOREIGN_KEY) {
        throw new HttpException(
          APP_CONSTANTS.UNABLE_TO_DELETE_MACHINE,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          APP_CONSTANTS.MACHINE_OR_MACHINELINE_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
