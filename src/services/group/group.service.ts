import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaValidation } from '@/common';
import {
  UpdateGroupDto,
  GroupDto,
  GroupResponseDto,
  GroupsResponseDto,
} from '@/utils';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async getAllGroups(): Promise<GroupsResponseDto> {
    const groups = await this.prismaDynamic.findMany('group', {});
    return {
      statusCode: HttpStatus.OK,
      message: groups.map((group: any) => new GroupDto(group)),
    };
  }

  async getGroupById(id: string): Promise<GroupResponseDto> {
    const group = await this.prismaDynamic.findUnique('group', {
      where: { id },
    });

    if (!group) {
      throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: new GroupDto(group),
    };
  }

  async createGroup(data: Prisma.GroupCreateInput): Promise<GroupResponseDto> {
    try {
      const group = await this.prismaDynamic.create('group', data);
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
    id: string,
    data: UpdateGroupDto,
  ): Promise<GroupResponseDto> {
    try {
      const group = await this.prismaDynamic.findUnique('group', {
        where: { id },
      });

      if (!group) {
        throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
      }

      const updatedData = await this.prismaDynamic.update('group', {
        where: { id },
        data,
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

  async deleteGroup(id: string) {
    const group = await this.prismaDynamic.findUnique('group', {
      where: { id },
    });

    if (!group) {
      throw new HttpException('Group not exists', HttpStatus.BAD_REQUEST);
    }

    await this.prismaDynamic.delete('group', {
      where: { id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Group deleted successfully',
    };
  }

  async checkGroupName({ groupname }: { groupname: string }) {
    const group = await this.prismaDynamic.findUnique('group', {
      where: { groupname },
    });

    if (group) {
      return true;
    }
    return false;
  }
}
