import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PlantResponseDto, UpdatePlantDto } from '@/utils';
import { PrismaValidation, TABLES } from '@/common';

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
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException('Plant already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to create plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPlants(organizationId: any): Promise<PlantResponseDto> {
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
          Error: 'There no Organization',
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
          Error: 'There is no plant in this organisation',
        };
      }
    } catch (e) {
      throw new HttpException('unable to fetch plants', HttpStatus.BAD_REQUEST);
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
          Error: 'Organazation and Plant is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no plant',
        };
        // throw new HttpException(
        //   'Organazation and Plant is mismatching',
        //   HttpStatus.BAD_REQUEST,
        // );
      }
    } catch {
      throw new HttpException(
        'Organazation/Plant not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // async getPlantByUserId(
  //   userId: string,
  //   plantid: string,
  // ): Promise<PlantResponseDto> {
  //   let plant: any;

  //   let user: any;

  //   try {
  //     user = await this.prismaDynamic.findUnique(TABLES.USER, {
  //       where: { UserId: userId },
  //     });

  //     if (!user) {
  //       throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
  //     } else {
  //       plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
  //         where: { plantId: plantid },
  //       });
  //     }
  //   } catch {
  //     throw new HttpException(
  //       'Organazation/Plant not exists',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return {
  //     statusCode: HttpStatus.OK,

  //     message: plant,
  //   };
  // }

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
          Error: 'Organazation and Plant is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no plant',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Organization/Plant not exists',
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
          message: 'Plant deleted successfully',
        };
      } else if (
        checkPlant &&
        organization &&
        checkPlant?.organizationId !== organization?.organizationId
      ) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Organazation and Plant is mismatching',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'There no plant',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Organazation/Plant not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
