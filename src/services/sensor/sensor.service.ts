import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  SensorDto,
  SensorResponseDto,
  SensorResponseDtoForSensorPage,
  UpdateSensorDto,
} from '@/utils';
import { APP_CONSTANTS, PrismaValidation, TABLES } from '@/common';

@Injectable()
export class SensorService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async checkSensor(data: any): Promise<any> {
    try {
      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: data.sensorId },
      });
      const resultData = data.sensorId.toLowerCase();

      if (checkSensor?.sensorId === resultData) {
        return true;
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
        sensorDescription: data.sensorDescription,
        image: data.image,
        imageKey: data.imageKey,
        imageName: data.imageName,
        elementId: data.elements.connect.elementId,
      };
      if (checkSensor?.sensorId === resultData.sensorId) {
      } else {
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
      // let sensor: any;
      // let element: any;
      const element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId: elementId },
      });

      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: sensorId },
      });
      const sensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
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
      // let sensor: any;
      // let element: any;
      const element = await this.prismaDynamic.findUnique(TABLES.ELEMENT, {
        where: { elementId },
      });

      const checkSensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: sensorId },
      });

      const sensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
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

  async getElementsbySensorId(sensorId: string): Promise<SensorResponseDto> {
    let sensor: any;

    try {
      sensor = await this.prismaDynamic.findUnique(TABLES.SENSOR, {
        where: { sensorId: sensorId },
        include: {
          elements: {
            include: {
              machines: true,
            },
          },
        },
      });
      if (sensor) {
        return new SensorResponseDto({
          statusCode: HttpStatus.OK,
          message: new SensorDto(sensor),
        });
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

  async getSensorDetailsByPlantId(
    plantId: string,
    page: number,
    limit: number,
    sort: string,
  ): Promise<SensorResponseDtoForSensorPage> {
    let plant: any;

    try {
      const sensorCount = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
        include: {
          shops: {
            include: {
              machineLines: {
                include: {
                  machines: {
                    include: {
                      elements: {
                        include: {
                          sensors: true,
                        },
                      },
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
                        include: {
                          sensors: {
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
                for (let m = 0; m < elementDetails.sensors.length; m++) {
                  const sensorDetails = elementDetails.sensors[m];
                  resultDetails.push({
                    sensorId: sensorDetails.sensorId,
                    sensorDescription: sensorDetails.sensorDescription,
                    image: sensorDetails.image,
                  });
                }
              }
            }
          }
        }
      }

      const sensor = sensorCount?.shops?.flatMap((shop) =>
        shop?.machineLines?.flatMap((machineLine) =>
          machineLine?.machines?.flatMap((machine) =>
            machine?.elemnets?.flatMap((element) => element?.sensors),
          ),
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
            total_items: sensor?.length || 0,
            totalPage: Math.ceil((sensor?.length || 0) / limit),
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
