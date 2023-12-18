import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SensorResponseDto, UpdateSensorDto } from '@/utils';
import { APP_CONSTANTS, PrismaValidation, TABLES } from '@/common';

@Injectable()
export class SensorService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async checkSensor(
    data: any,
  ): Promise<any> {
    try {
      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: data.sensorId },
      });
       let resultData = data.sensorId.toLowerCase()

      if (checkSensor?.sensorId === resultData) {
       return true
      } 
    } catch (error) {
      console.log(error);
      if (
        error.response.code ||
        error.response === PrismaValidation.ALREADY_EXITS
      ) {
        throw new HttpException(
          APP_CONSTANTS.SENSOR_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async createSensor(
    data: Prisma.SensorCreateInput,
  ): Promise<SensorResponseDto> {
    try {
      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: data.sensorId },
      });
      
      const resultData = {
        sensorId: data.sensorId.toLowerCase(),
        sensorName: data.sensorName,
        sensorDescription: data.sensorDescription,
        image: data.image,
        imageName: data.imageName,
        elementId: data.elements.connect.elementId,
      };
      console.log(resultData)

      if (checkSensor?.sensorId === resultData.sensorId) {
      
      } 
      else{
        const sensor = await this.prismaDynamic.create(
            TABLES.SENSOR,
            resultData,
          );
          return {
            statusCode: HttpStatus.CREATED,
            message: sensor,
          };
      }
    } catch (error) {
      console.log(error);
      if (
        error.response.code ||
        error.response === PrismaValidation.ALREADY_EXITS
      ) {
        throw new HttpException(
          APP_CONSTANTS.SENSOR_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_SENSOR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSensors(
    page: number,
    limit: number,
    sort: string,
  ): Promise<SensorResponseDto> {
    try {
      const sensorCount = await this.prismaDynamic.findMany(TABLES.SENSOR, {});
      const sensor = await this.prismaDynamic.findMany(TABLES.SENSOR, {
        orderBy: [
          {
            createdAt: sort,
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      });
      if (sensor.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: sensor,
          meta: {
            current_page: page,
            item_count: limit,
            total_items: sensorCount.length,
            totalPage: Math.ceil(sensorCount.length / limit),
          },
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_SENSOR,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_SENSORS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAllSensor(elementId: any): Promise<SensorResponseDto> {
    try {
      const element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });
      if (!element) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_ELEMENT,
        };
      }
      const sensor = await this.prismaDynamic.findMany(TABLES.SENSOR, {
        where: { elementId: element.elementId },
      });
      if (sensor.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: sensor,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_SENSOR_IN_THIS_ELEMENT,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_SENSORS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getSensorByElementId(
    elementId: string,
    sensorId: string,
  ): Promise<SensorResponseDto> {
    let sensor: any;

    let element: any;

    try {
      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });

      const checksensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: {
          sensorId: sensorId,
        },
      });
      sensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: {
          sensorId: sensorId,
          elementId: element.elementId,
        },
      });

      if (sensor) {
        return sensor;
      } else if (checksensor && checksensor?.elementId !== element?.elementId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.SENSOR_AND_ELEMENT_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_SENSOR,
        };
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.SENSOR_OR_ELEMENT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSensor(
    elementId: string,
    sensorId: string,
    data: UpdateSensorDto,
  ): Promise<SensorResponseDto> {
    try {
      let sensor: any;
      let element: any;
      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });

      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: sensorId },
      });
      sensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: {
          sensorId: sensorId,
          elementId: element.elementId,
        },
      });
      if (sensor) {
        const updatedData = await this.prismaDynamic.update(TABLES.SENSOR, {
          where: { sensorId: sensorId },
          data,
        });

        return new SensorResponseDto({
          statusCode: HttpStatus.OK,
          message: updatedData,
        });
      } else if (checkSensor && checkSensor?.elementId !== element?.elementId) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.SENSOR_AND_ELEMENT_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_SENSOR,
        };
      }
    } catch (error) {
      throw new HttpException(
        APP_CONSTANTS.SENSOR_OR_ELEMENT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteSensor(elementId: string, sensorId: string) {
    try {
      let sensor: any;
      let element: any;
      element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId },
      });

      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: sensorId },
      });

      sensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: {
          sensorId: sensorId,
          elementId: element.elementId,
        },
      });

      if (sensor) {
        await this.prismaDynamic.delete(TABLES.SENSOR, {
          where: {
            sensorId: sensor.sensorId,
            elementId: element?.elementId,
          },
        });
        return {
          statusCode: HttpStatus.OK,
          message: APP_CONSTANTS.SENSOR_DELETED_SUCCESSFULLY,
        };
      } else if (
        checkSensor &&
        element &&
        checkSensor?.elementId !== element?.elementId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.SENSOR_AND_ELEMENT_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.NO_SENSOR,
        };
      }
    } catch (error) {
      if (error.response.code === PrismaValidation.FOREIGN_KEY) {
        throw new HttpException(
          APP_CONSTANTS.UNABLE_TO_DELETE_SENSOR,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          APP_CONSTANTS.SENSOR_OR_ELEMENT_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
