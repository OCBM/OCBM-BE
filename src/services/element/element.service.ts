import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  ElementResponseDto,
  ElementResponseDtoForGetByPlantId,
  UpdateElementDto,
} from '@/utils';
import { APP_CONSTANTS, PrismaValidation, TABLES } from '@/common';

@Injectable()
export class ElementService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async createElement(
    data: Prisma.ElementCreateInput,
  ): Promise<ElementResponseDto> {
    try {
      const element = await this.prismaDynamic.create(TABLES.ELEMENT, data);
      return {
        statusCode: HttpStatus.CREATED,
        message: element,
      };
    } catch (error) {
      console.log(error);
      if (error.response.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          APP_CONSTANTS.ELEMENT_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_ELEMENT,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllElements(
    page: number,
    limit: number,
    sort: string,
  ): Promise<ElementResponseDto> {
    try {
      const elementCount = await this.prismaDynamic.findMany(
        TABLES.ELEMENT,
        {},
      );
      const element = await this.prismaDynamic.findMany(TABLES.ELEMENT, {
        orderBy: [
          {
            createdAt: sort,
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      });
      if (element.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: element,
          meta: {
            current_page: page,
            item_count: limit,
            total_items: elementCount.length,
            totalPage: Math.ceil(elementCount.length / limit),
          },
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_ELEMENT,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_ELEMENTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAllElement(machineId: any): Promise<ElementResponseDto> {
    try {
      const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });
      if (!machine) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_MACHINE,
        };
      }
      const element = await this.prismaDynamic.findMany(TABLES.ELEMENT, {
        where: { machineId: machine.machineId },
      });
      if (element.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: element,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_ELEMENT_IN_THIS_MACHINE,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_ELEMENTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getElementByMachineId(
    machineId: string,
    elementId: string,
  ): Promise<ElementResponseDto> {
    let element: any;

    let machine: any;

    try {
      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });

      const checkelement = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: {
          elementId: elementId,
        },
      });
      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: {
          elementId: elementId,
          machineId: machine.machineId,
        },
      });

      if (element) {
        return element;
      } else if (
        checkelement &&
        checkelement?.machineId !== machine?.machineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.ELEMENT_AND_MACHINE_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_ELEMENT,
        };
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.ELEMENT_OR_MACHINE_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateElement(
    machineId: string,
    elementId: string,
    data: UpdateElementDto,
  ): Promise<ElementResponseDto> {
    try {
      //let element: any;
      // let machine: any;
      const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });

      const checkElement = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });
      const element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: {
          elementId: elementId,
          machineId: machine.machineId,
        },
      });
      if (element) {
        const updatedData = await this.prismaDynamic.update(TABLES.ELEMENT, {
          where: { elementId: elementId },
          data,
        });

        return new ElementResponseDto({
          statusCode: HttpStatus.OK,
          message: updatedData,
        });
      } else if (
        checkElement &&
        checkElement?.machineId !== machine?.machineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.ELEMENT_AND_MACHINE_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_ELEMENT,
        };
      }
    } catch (error) {
      throw new HttpException(
        APP_CONSTANTS.ELEMENT_OR_MACHINE_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteElement(machineId: string, elementId: string) {
    try {
      // let element: any;
      // let machine: any;
      const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId },
      });

      const checkElement = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });

      const element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: {
          elementId: elementId,
          machineId: machine.machineId,
        },
      });

      if (element) {
        await this.prismaDynamic.delete(TABLES.ELEMENT, {
          where: {
            elementId: element.elementId,
            machineId: machine?.machineId,
          },
        });
        return {
          statusCode: HttpStatus.OK,
          message: APP_CONSTANTS.ELEMENT_DELETED_SUCCESSFULLY,
        };
      } else if (
        checkElement &&
        machine &&
        checkElement?.machineId !== machine?.machineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.ELEMENT_AND_MACHINE_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_ELEMENT,
        };
      }
    } catch (error) {
      if (error.response.code === PrismaValidation.FOREIGN_KEY) {
        throw new HttpException(
          APP_CONSTANTS.UNABLE_TO_DELETE_ELEMENT,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          APP_CONSTANTS.ELEMENT_OR_MACHINE_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async getElementDetailsByPlantId(
    plantId: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<ElementResponseDtoForGetByPlantId> {
    let plant: any;

    try {
      const elementCount = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
        include: {
          shops: {
            include: {
              machineLines: {
                include: {
                  machines: {
                    include: {
                      elements: true,
                    },
                  },
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
                    include: {
                      elements: {
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
              for (let l = 0; l < machineDetails.elements.length; l++) {
                const elementDetails = machineDetails.elements[l];
                resultDetails.push(elementDetails);
              }
            }
          }
        }
      }
      const element = elementCount?.shops?.flatMap((shop) =>
        shop?.machineLines?.flatMap((machineLine) =>
          machineLine?.machines?.flatMap((machine) => machine?.elemnets),
        ),
      );
      console.log('resultDetails', resultDetails);
      if (resultDetails) {
        return {
          statusCode: HttpStatus.OK,
          message: resultDetails,
          meta: {
            current_page: page,
            item_count: limit,
            total_items: element?.length || 0,
            totalPage: Math.ceil((element?.length || 0) / limit),
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
