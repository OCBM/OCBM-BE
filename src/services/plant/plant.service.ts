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

  async getAllPlants(plant: any): Promise<PlantResponseDto> {
    try {
      const plants = await this.prismaDynamic.findMany(TABLES.PLANT, {});
      return {
        statusCode: HttpStatus.OK,
        message: plants,
      };
    } catch (e) {
      throw new HttpException('unable to fetch plants', HttpStatus.BAD_REQUEST);
    }
  }

  async getPlantById(plantid: string): Promise<PlantResponseDto> {
    let plant: any;
    try {
      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantid },
      });
    } catch {
      throw new HttpException('plant not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: plant,
    };
  }

  async updatePlant(
    plantid: string,
    data: UpdatePlantDto,
  ): Promise<PlantResponseDto> {
    try {
      let plant: any;

      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantid },
      });
      if (!plant) {
        throw new HttpException('Plant not exists', HttpStatus.BAD_REQUEST);
      } else {
        var updatedData = await this.prismaDynamic.update(TABLES.PLANT, {
          where: { plantid },
          data,
        });
      }
      return new PlantResponseDto({
        statusCode: HttpStatus.OK,
        message: updatedData,
      });
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('Plant not exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to update plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePlant(plantid: string) {
    try {
      let plant: any;

      plant = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: { plantid },
      });
      if (!plant) {
        throw new HttpException('Plant not exists', HttpStatus.BAD_REQUEST);
      } else {
        await this.prismaDynamic.delete(TABLES.PLANT, {
          where: { plantid },
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Plant deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to delete plant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
