import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { OrganizationResponseDto, UpdateOrganizationDto } from '@/utils';
import { PrismaValidation, TABLES, APP_CONSTANTS } from '@/common';

@Injectable()
export class OrganizationService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<OrganizationResponseDto> {
    try {
      const organization = await this.prismaDynamic.create(
        TABLES.ORGANIZATION,
        data,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: organization,
      };
    } catch (error) {
      console.log(error);
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          APP_CONSTANTS.ORGANIZATION_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_ORGANIZATION,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllOrganization(
    organization: any,
  ): Promise<OrganizationResponseDto> {
    try {
      const organization = await this.prismaDynamic.findMany(
        TABLES.ORGANIZATION,
        {},
      );
      return {
        statusCode: HttpStatus.OK,
        message: organization,
      };
    } catch (e) {
      throw new HttpException(
        APP_CONSTANTS.UNABLE_TO_FETCH_ORGANIZATION,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizationById(
    organizationId: string,
  ): Promise<OrganizationResponseDto> {
    let organization: any;
    try {
      organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
        where: { organizationId },
      });
    } catch {
      throw new HttpException(
        APP_CONSTANTS.ORGANIZATION_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: organization,
    };
  }

  async updateOrganization(
    organizationId: string,
    data: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    try {
      let organization: any;

      organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
        where: { organizationId },
      });
      if (!organization) {
        throw new HttpException(
          APP_CONSTANTS.ORGANIZATION_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        var updatedData = await this.prismaDynamic.update(TABLES.ORGANIZATION, {
          where: { organizationId },
          data,
        });
      }
      return new OrganizationResponseDto({
        statusCode: HttpStatus.OK,
        message: updatedData,
      });
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(
         APP_CONSTANTS.ORGANIZATION_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_UPDATE_ORGANIZATION,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrganization(organizationId: string) {
    try {
      let organization: any;

      organization = await this.prismaDynamic.findUnique(TABLES.ORGANIZATION, {
        where: { organizationId },
      });
      if (!organization) {
        throw new HttpException(
          APP_CONSTANTS.ORGANIZATION_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.prismaDynamic.delete(TABLES.ORGANIZATION, {
          where: { organizationId },
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: APP_CONSTANTS.ORGANIZATION_DELETED_SUCCESFULLY,
      };
    } catch (error) {
      if(error.response.code === PrismaValidation.FOREIGN_KEY){
        throw new HttpException(
          APP_CONSTANTS.UNABLETODELETE,
          HttpStatus.BAD_REQUEST,
        );
      } else{
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_DELETE_ORGANIZATION,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      }
    }
  }
}
