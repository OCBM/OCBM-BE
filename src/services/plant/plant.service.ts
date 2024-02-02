import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  PlantResponseDto,
  PlantResponseDtoForSetStandards,
  UpdatePlantDto,
} from '@/utils';
import { APP_CONSTANTS, PrismaValidation, TABLES } from '@/common';

@Injectable()
export class PlantService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async createPlant(data: Prisma.PlantCreateInput): Promise<PlantResponseDto> {
    try {
      const plant = await this.prismaDynamic.create(TABLES.PLANT, data);
      return {
        statusCode: HttpStatus.CREATED,
        message: plant,
      };
    } catch (error) {
      console.log(error);
      if (error.response.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          APP_CONSTANTS.PLANT_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_PLANT,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPlants(
    page: number,
    limit: number,
    sort: string,
  ): Promise<PlantResponseDto> {
    try {
      const plantsCount = await this.prismaDynamic.findMany(TABLES.PLANT, {});
      const plants = await this.prismaDynamic.findMany(TABLES.PLANT, {
        orderBy: [
          {
            createdAt: sort,
          },
        ],
        skip: (page - 1) * limit,
        take: limit,
      });
      if (plants.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: plants,
          meta: {
            current_page: page,
            item_count: limit,
            total_items: plantsCount.length,
            totalPage: Math.ceil(plantsCount.length / limit),
          },
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.NO_PLANT,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_PLANTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPlantsByOrganization(
    organizationId: any,
  ): Promise<PlantResponseDto> {
    try {
      const organization = await this.prismaDynamic.findUnique(
        TABLES.ORGANIZATION,
        {
          where: { organizationId: organizationId },
        },
      );
      if (!organization) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_NO_ORGANIZATION,
        };
      }
      const plants = await this.prismaDynamic.findMany(TABLES.PLANT, {
        where: { organizationId: organization.organizationId },
      });
      if (plants.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: plants,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.THERE_IS_NO_PLANT_IN_THIS_ORGANIZATION,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_PLANTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPlantsByUser(userId: any): Promise<PlantResponseDto> {
    try {
      // const user = await this.prismaDynamic.findUnique(TABLES.USER, {
      //   where: { userId: userId },
      //   include: { plants: true },
      // });

      const user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId: userId },
        include: { plants: true },
      });
      // if (!user) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: APP_CONSTANTS.THERE_IS_NO_USER_AND_ADMIN,
      //   };
      // }
      const plants = user?.plants;
      if (plants.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: plants,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          Error: APP_CONSTANTS.THERE_IS_NO_PLANT_FOR_THIS_USER,
        };
      }
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_PLANTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPlantByOrganizationId(
    organizationId: string,
    plantid: string,
  ): Promise<PlantResponseDto> {
    let plant: any;

    let organization: any;

    try {
      organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
        where: { organizationId: organizationId },
      });
      // if (!organization) {
      //   // throw new HttpException('Invalid Organization', HttpStatus.BAD_REQUEST);
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     message: organization,
      //   };
      // }
      const checkPlant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: {
          plantId: plantid,
        },
      });
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: {
          plantId: plantid,
          organizationId: organization.organizationId,
        },
      });

      console.log(organization, plant, checkPlant);
      if (plant) {
        return plant;
      } else if (
        checkPlant &&
        checkPlant?.organizationId !== organization?.organizationId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.ORGANIZATION_AND_PLANT_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_NO_PLANT,
        };
        // throw new HttpException(
        //   'Organazation and Plant is mismatching',
        //   HttpStatus.BAD_REQUEST,
        // );
      }
    } catch {
      throw new HttpException(
        APP_CONSTANTS.ORGANIZATION_AND_PLANT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePlant(
    organizationId: string,
    plantid: string,
    data: UpdatePlantDto,
    // imageUpload: string,
  ): Promise<PlantResponseDto> {
    try {
      // let plant: any;
      // let organization: any;
      const organization = await this.prismaDynamic.findUnique(
        TABLES.ORGANIZATION,
        {
          where: { organizationId: organizationId },
        },
      );
      // if (!organization) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Organization not exist',
      //   };
      // }
      const checkPlant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantid },
      });
      // if (!checkPlant) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Plant not exist',
      //   };
      // }

      const plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: {
          plantId: plantid,
          organizationId: organization.organizationId,
        },
      });

      if (plant) {
        const updatedData = await this.prismaDynamic.update(TABLES.PLANT, {
          where: { plantId: plantid },
          data,
          //imageUpload,
        });

        return new PlantResponseDto({
          statusCode: HttpStatus.OK,
          message: updatedData,
        });
      } else if (
        checkPlant &&
        checkPlant?.organizationId !== organization?.organizationId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.ORGANIZATION_AND_PLANT_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_NO_PLANT,
        };
      }
    } catch (error) {
      throw new HttpException(
        APP_CONSTANTS.ORGANIZATION_AND_PLANT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deletePlant(organizationId: string, plantId: string) {
    try {
      // let plant: any;
      // let organization: any;
      const organization = await this.prismaDynamic.findUnique(
        TABLES.ORGANIZATION,
        {
          where: { organizationId },
        },
      );
      // if (!organization) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Organization not Exists',
      //   };
      // }
      const checkPlant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantId: plantId },
      });
      // if (!plant) {
      //   return {
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     Error: 'Plant not Exists',
      //   };
      // }
      const plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: {
          plantId: plantId,
          organizationId: organization.organizationId,
        },
      });

      if (plant) {
        await this.prismaDynamic.delete(TABLES.PLANT, {
          where: {
            plantId: plant.plantId,
            organizationId: organization?.organizationId,
          },
        });
        return {
          statusCode: HttpStatus.OK,
          message: APP_CONSTANTS.PLANT_DELETED_SUCCESSFULLY,
        };
      } else if (
        checkPlant &&
        organization &&
        checkPlant?.organizationId !== organization?.organizationId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.ORGANIZATION_AND_PLANT_IS_MISMATCHING,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_NO_PLANT,
        };
      }
    } catch (error) {
      if (error.response.code === PrismaValidation.FOREIGN_KEY) {
        throw new HttpException(
          APP_CONSTANTS.UNABLE_TO_DELETE_PLANT,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          APP_CONSTANTS.ORGANIZATION_AND_PLANT_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async getDetailsForSetStandardsByPlantId(
    plantId: string,
  ): Promise<PlantResponseDtoForSetStandards> {
    let plant: any;

    try {
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
                  console.log(
                    'm',
                    sensorDetails.sensorId && sensorDetails.sensorDescription,
                  );
                  resultDetails.push({
                    machine: machineDetails.machineName,
                    machineNumber: machineDetails.machineNumber,
                    element: elementDetails.elementName,
                    sensorId: sensorDetails.sensorId,
                    sensorDescription: sensorDetails.sensorDescription,
                  });
                }
              }
            }
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
}
