import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TokenType } from '@/common';
import { PrismaValidation, Role } from '@/common';
import {
  UpdateUserDto,
  UserDto,
  UserResponseDto,
  UsersResponseDto,
} from '@/utils';
import { Prisma } from '@prisma/client';
import { PrismaDynamicQueries } from '@/utils/dynamicQueries/PrismaDynamicQueries';

@Injectable()
export class UserService {
  constructor(private readonly prismaDynamic: PrismaDynamicQueries) {}

  async getOwnProfile(user: TokenType): Promise<UserResponseDto> {
    let userDetails: any;
    if (user.role === Role.ADMIN) {
      userDetails = await this.prismaDynamic['admin'].findUnique({
        where: { userid: user.userid },
      });
    } else if (user.role === Role.USER) {
      userDetails = await this.prismaDynamic['user'].findUnique({
        where: { userid: user.userid },
      });
    }

    if (!userDetails) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: new UserDto(userDetails),
    };
  }

  async getAllUsers(role: Role): Promise<UsersResponseDto> {
    let users: any;
    if (role === Role.ADMIN) {
      users = await this.prismaDynamic['admin'].findMany({});
    } else if (role === Role.USER) {
      users = await this.prismaDynamic['user'].findMany({});
    } else if (role === Role.SUPERADMIN) {
      throw new HttpException(
        'Super Admin not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: users.map((user: any) => new UserDto(user)),
    };
  }

  async getUserById(userid: number, role: Role): Promise<UserResponseDto> {
    let user: any;
    if (role === Role.ADMIN) {
      user = await this.prismaDynamic['admin'].findUnique({
        where: { userid },
      });
    } else if (role === Role.USER) {
      user = await this.prismaDynamic['user'].findUnique({
        where: { userid },
      });
    }
    if (!user) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: new UserDto(user),
    };
  }

  async createSuperAdmin() {}

  async createUser(data: Prisma.UserCreateInput): Promise<UserResponseDto> {
    try {
      const user = await this.prismaDynamic['user'].create({
        data,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: new UserDto(user),
      };
    } catch (error) {
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAdmin(data: Prisma.UserCreateInput): Promise<UserResponseDto> {
    try {
      const user = await this.prismaDynamic['admin'].create({
        data,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: new UserDto(user),
      };
    } catch (error) {
      if (error.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to create admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAdmin(
    userid: number,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user: any = await this.prismaDynamic['admin'].findUnique({
        where: { userid },
      });

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      const updatedData = await this.prismaDynamic['admin'].update({
        where: { userid },
        data,
      });
      return new UserResponseDto({
        statusCode: HttpStatus.OK,
        message: new UserDto(updatedData),
      });
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to update admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    userid: number,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user: any = await this.prismaDynamic['user'].findUnique({
        where: { userid },
      });

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      const updatedData = await this.prismaDynamic['user'].update({
        where: { userid },
        data,
      });
      return new UserResponseDto({
        statusCode: HttpStatus.OK,
        message: new UserDto(updatedData),
      });
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAdmin(userid: number) {
    try {
      const user: any = await this.prismaDynamic['admin'].findUnique({
        where: { userid },
      });

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      await this.prismaDynamic['admin'].delete({
        where: { userid },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to delete admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(userid: number) {
    try {
      const user: any = await this.prismaDynamic['user'].findUnique({
        where: { userid },
      });

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      await this.prismaDynamic['user'].delete({
        where: { userid },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
