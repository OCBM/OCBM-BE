import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  MachineResponseDto,
  MachineResponseDtoForGetByPlantId,
  MachineResponseDtoForSetStandards,
  UpdateMachineDto,
} from '@/utils';
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
      if (error.response.code === PrismaValidation.ALREADY_EXITS) {
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

  async getAllMachines(
    page: number,
    limit: number,
    sort: string,
  ): Promise<MachineResponseDto> {
    try {
      const machineCount = await this.prismaDynamic.findMany(
        TABLES.MACHINE,
        {},
      );
      const machine = await this.prismaDynamic.findMany(TABLES.MACHINE, {
        orderBy: [
          {
            createdAt: sort,
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      });
      if (machine.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: machine,
          meta: {
            current_page: page,
            item_count: limit,
            total_items: machineCount.length,
            totalPage: Math.ceil(machineCount.length / limit),
          },
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
      // let machine: any;
      // let machineLine: any;
      const machineLine = await this.prismaDynamic.findUnique(
        TABLES.MACHINELINE,
        {
          where: { machineLineId: machineLineId },
        },
      );

      const checkmachine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });
      const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
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
      // let machine: any;
      // let machineLine: any;
      const machineLine = await this.prismaDynamic.findUnique(
        TABLES.MACHINELINE,
        {
          where: { machineLineId },
        },
      );

      const checkmachine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });

      const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
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
  async getDetailsForSetStandardsByMachineId(
    machineId: string,
  ): Promise<MachineResponseDtoForSetStandards> {
    let machine: any;

    try {
      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
        include: {
          elements: {
            include: {
              sensors: true,
            },
          },
        },
      });
      const resultDetails = [];
      if (machine.elements.length > 0) {
        for (let i = 0; i < machine.elements.length; i++) {
          const elementDetails = machine.elements[i];
          for (let m = 0; m < elementDetails.sensors.length; m++) {
            const sensorDetails = elementDetails.sensors[m];
            resultDetails.push({
              machine: machine.machineName,
              element: elementDetails.elementName,
              sensorId: sensorDetails.sensorId,
              sensorDescription: sensorDetails.sensorDescription,
            });
          }
        }
      }
      console.log('resultDetails', resultDetails);
      if (resultDetails) {
        return {
          statusCode: HttpStatus.OK,
          message: resultDetails,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_PLANT,
        };
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.THERE_NO_PLANT,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMachineDetailsByPlantId(
    plantId: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<MachineResponseDtoForGetByPlantId> {
    let plant: any;

    try {
      const machineCount = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
        include: {
          shops: {
            include: {
              machineLines: {
                include: {
                  machines: true,
                },
              },
            },
          },
        },
      });
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
        include: {
          shops: {
            include: {
              machineLines: {
                include: {
                  machines: {
                    orderBy: [
                      {
                        createdAt: sort,
                      },
                    ],
                    skip: (page - 1) * limit,
                    take: limit,
                  },
                },
              },
            },
          },
        },
      });
      const resultDetails = [];
      if (plant.shops.length > 0) {
        for (let i = 0; i < plant.shops.length; i++) {
          const shopsDetails = plant.shops[i];
          for (let j = 0; j < shopsDetails.machineLines.length; j++) {
            const machineLineDetailes = shopsDetails.machineLines[j];
            for (let k = 0; k < machineLineDetailes.machines.length; k++) {
              const machineDetails = machineLineDetailes.machines[k];
              resultDetails.push(machineDetails );
            }
          }
        }
      }
      const machine = machineCount?.shops?.flatMap(
        (shop) => shop?.machineLines?.flatMap(machineLine => machineLine?.machines),
      );
      console.log('resultDetails', resultDetails);
      if (resultDetails) {
        return {
          statusCode: HttpStatus.OK,
          message: resultDetails,
          meta: {
            current_page: page,
            item_count: limit,
            total_items: machine?.length || 0,
            totalPage: Math.ceil((machine?.length || 0) / limit),
          },
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_PLANT,
        };
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.THERE_NO_PLANT,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
