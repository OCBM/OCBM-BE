import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PlantResponseDto, UpdatePlantDto } from '@/utils';
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

  async getAllPlants(): Promise<PlantResponseDto> {
    try {
      const plants = await this.prismaDynamic.findMany(TABLES.PLANT, {});
      if (plants.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: plants,
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
          Error: APP_CONSTANTS.THETE_IS_NO_PLANT_IN_THIS_ORGANIZATION,
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
      const user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId: userId },
        include: { plants: true },
      });

      const admin = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
        where: { userId: userId },
        include: { plants: true },
      });
      if (!user && !admin) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: APP_CONSTANTS.THERE_IS_NO_USER_AND_ADMIN,
        };
      }
      const plants = user?.plants || admin?.plants;
      if (plants?.length) {
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
  ): Promise<PlantResponseDto> {
    try {
      let plant: any;
      let organization: any;
      organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
        where: { organizationId: organizationId },
      });
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

      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: {
          plantId: plantid,
          organizationId: organization.organizationId,
        },
      });
      if (plant) {
        const updatedData = await this.prismaDynamic.update(TABLES.PLANT, {
          where: { plantId: plantid },
          data,
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
      let plant: any;
      let organization: any;
      organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
        where: { organizationId },
      });
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
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
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
          message: APP_CONSTANTS.PLANT_DELETEd_SUCCESSFULLY,
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
}
