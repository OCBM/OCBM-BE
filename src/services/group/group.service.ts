import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaValidation, TABLES } from '@/common';
import {
  UpdateGroupDto,
  GroupDto,
  GroupResponseDto,
  GroupsResponseDto,
  CreateGroupDto,
} from '@/utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async getAllGroups(): Promise<GroupsResponseDto> {
    const groups = await this.prismaDynamic.findMany(TABLES.GROUP, {
      include: { services: true },
    });
    return {
      statusCode: HttpStatus.OK,
      message: groups.map((group: any) => new GroupDto(group)),
    };
  }

  async getGroupById(groupId: string): Promise<GroupResponseDto> {
    const group = await this.prismaDynamic.findUnique(TABLES.GROUP, {
      where: { groupId },
      include: { services: true },
    });

    if (!group) {
      throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: new GroupDto(group),
    };
  }

  async createGroup(data: CreateGroupDto): Promise<GroupResponseDto> {
    let createpayload: any;
    const services = { create: [...data.services] };
    createpayload = {
      ...data,
      services,
    };
    try {
      const checkgroupNameExist = await this.checkGroupName(data.groupName);
      if (checkgroupNameExist) {
        throw new HttpException(
          'groupName already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const group = await this.prismaDynamic.create(
        TABLES.GROUP,
        createpayload,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: new GroupDto(group),
      };
    } catch (error) {
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException('Group already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to create Group',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateGroup(
    groupId: string,
    data: UpdateGroupDto,
  ): Promise<GroupResponseDto> {
    try {
      const { services, ...groupdata }: { services: any } = data;

      const group = await this.prismaDynamic.findUnique(TABLES.GROUP, {
        where: { groupId },
      });

      if (!group) {
        throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
      }

      if (services.length) {
        const deleteExistingService = await this.prismaDynamic.deleteMany(
          TABLES.Service,
          { where: { groupId } },
        );
        services.map((services: any) => {
          services.groupId = groupId;
        });
        const createNewServices = await this.prismaDynamic.createMany(
          TABLES.Service,
          services,
        );
      }
      const updatedData = await this.prismaDynamic.update(TABLES.GROUP, {
        where: { groupId },
        data: groupdata,
        include: { services: true },
      });
      return new GroupResponseDto({
        statusCode: HttpStatus.OK,
        message: new GroupDto(updatedData),
      });
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to update Group',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteGroup(groupId: string) {
    const group = await this.prismaDynamic.findUnique(TABLES.GROUP, {
      where: { groupId },
    });

    if (!group) {
      throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
    }
    await this.prismaDynamic.deleteMany(TABLES.Service, { where: { groupId } });
    await this.prismaDynamic.delete(TABLES.GROUP, {
      where: { groupId },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Group deleted successfully',
    };
  }

  async checkGroupName(groupName: string) {
    const group = await this.prismaDynamic.findUnique(TABLES.GROUP, {
      where: { groupName },
    });

    if (group) {
      return true;
    }
    return false;
  }
}
