import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ElementResponseDto, UpdateElementDto } from '@/utils';
import { PrismaValidation, TABLES } from '@/common';

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
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          'Element already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create element',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllElements(): Promise<ElementResponseDto> {
    try {
      const element = await this.prismaDynamic.findMany(TABLES.ELEMENT, {});
      if (element.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: element,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: 'There is no Element',
        };
      }
    } catch (e) {
      throw new HttpException(
        'unable to fetch Element',
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
          Error: 'There no Machine',
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
          Error: 'There is no Element in this Machine',
        };
      }
    } catch (e) {
      throw new HttpException(
        'unable to fetch elements',
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
          Error: 'Machine and element is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no Element',
        };
      }
    } catch {
      throw new HttpException(
        'Element/Machine not exists',
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
      let element: any;
      let machine: any;
      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId: machineId },
      });

      const checkElement = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });
      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
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
          Error: 'Machine and Element is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no element',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Machine/Element not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteElement(machineId: string, elementId: string) {
    try {
      let element: any;
      let machine: any;
      machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
        where: { machineId },
      });

      const checkElement = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });

      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
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
          message: 'Element deleted successfully',
        };
      } else if (
        checkElement &&
        machine &&
        checkElement?.machineId !== machine?.machineId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Machine and Element is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no Element',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Machine/Element not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
