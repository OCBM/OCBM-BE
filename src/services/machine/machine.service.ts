import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MachineResponseDto, UpdateMachineDto } from '@/utils';
import { PrismaValidation, TABLES } from '@/common';

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
          'Machine already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create machine',
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
          Error: 'There is no Machine',
        };
      }
    } catch (e) {
      throw new HttpException(
        'unable to fetch Machine',
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
          Error: 'There no machineLine',
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
          Error: 'There is no Machine in this machineLine',
        };
      }
    } catch (e) {
      throw new HttpException(
        'unable to fetch machines',
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
          Error: 'MachineLine and machine is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no Machine',
        };
      }
    } catch {
      throw new HttpException(
        'Machine/MachineLine not exists',
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
          Error: 'MachineLine and Machine is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no machine',
        };
      }
    } catch (error) {
      throw new HttpException(
        'MachineLine/Machine not exists',
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
          message: 'MachineLine deleted successfully',
        };
      } else if (
        checkmachine &&
        machineLine &&
        checkmachine?.machineLineId !== machineLine?.machineLineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'MachineLine and Machine is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no Machine',
        };
      }
    } catch (error) {
      throw new HttpException(
        'MachineLine/Machine not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
