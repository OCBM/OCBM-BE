import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { OrganizationResponseDto, UpdateOrganizationDto } from '@/utils';
import { PrismaValidation } from '@/common';

@Injectable()
export class OrganizationService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async createOrganization(
    data: Prisma.OrganizationCreateInput,
  ): Promise<OrganizationResponseDto> {
    try {
      const organization = await this.prismaDynamic.create(
        'organization',
        data,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: organization,
      };
    } catch (error) {
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          'Organization already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllOrganization(
    organization: any,
  ): Promise<OrganizationResponseDto> {
    try {
      const organization = await this.prismaDynamic.findMany(
        'organization',
        {},
      );
      return {
        statusCode: HttpStatus.OK,
        message: organization,
      };
    } catch (e) {
      throw new HttpException(
        'Unable to fetch organization',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizationById(
    organizationid: string,
  ): Promise<OrganizationResponseDto> {
    let organization: any;
    try {
      organization = await this.prismaDynamic.findUnique('organization', {
        where: { organization },
      });
    } catch {
      throw new HttpException(
        'Organization not exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: organization,
    };
  }

  async updateOrganization(
    organizationid: string,
    data: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    try {
      let organization: any;

      organization = await this.prismaDynamic.findUnique('organization', {
        where: { organizationid },
      });
      if (!organization) {
        throw new HttpException(
          'Organization not exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        var updatedData = await this.prismaDynamic.update('organization', {
          where: { organizationid },
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
          'organization not exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to update organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrganization(organizationid: string) {
    try {
      let organization: any;

      organization = await this.prismaDynamic.findUnique('organization', {
        where: { organizationid },
      });
      if (!organization) {
        throw new HttpException(
          'Organization not exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.prismaDynamic.delete('organization', {
          where: { organizationid },
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Organization deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to delete organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
