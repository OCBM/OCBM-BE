import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TABLES, TokenType } from '@/common';
import { PrismaValidation, Role } from '@/common';
import {
  UpdateUserDto,
  UserDto,
  UserResponseDto,
  UsersResponseDto,
} from '@/utils';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserData } from '@/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async getAllUserswithoutRole(): Promise<UserResponseDto> {
    let userDetails: any;
    userDetails = await this.prismaDynamic
      .$queryRaw`SELECT * FROM "Admin" UNION SELECT * from "User"`;
    return {
      statusCode: HttpStatus.OK,
      message: userDetails,
    };
  }

  async getOwnProfile(user: TokenType): Promise<UserResponseDto> {
    let userDetails: UserData;
    if (user.role === Role.ADMIN) {
      userDetails = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
        where: { userId: user.userId },
        include: {
          groups: true,
          organization: true,
          plants: true,
        },
      });
    } else if (user.role === Role.USER) {
      userDetails = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId: user.userId },
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
    let users: UserData[];

    try {
      if (role === Role.ADMIN) {
        users = await this.prismaDynamic.findMany(TABLES.ADMIN, {
          include: {
            groups: true,
            organization: true,
          },
        });
      } else if (role === Role.USER) {
        users = await this.prismaDynamic.findMany(TABLES.USER, {
          include: {
            groups: true,
            organization: true,
          },
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: users.map((user: UserData) => new UserDto(user)),
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    let user: UserData;

    user = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
      where: { userId },
      include: {
        groups: true,
        organization: true,
        plants: true,
      },
    });
    if (!user) {
      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId },
        include: {
          groups: true,
          organization: true,
          plants: true,
        },
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

  async CheckUsername(data: any) {
    let user: UserData;
    const username = data.username;

    try {
      user = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
        where: { username },
      });

      if (!user) {
        user = await this.prismaDynamic.findUnique(TABLES.USER, {
          where: { username },
        });
      }

      if (user) {
        return true;
      }
      return false;
    } catch (e) {}
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserResponseDto> {
    try {
      const user = await this.prismaDynamic.create(TABLES.USER, data);
      return {
        statusCode: HttpStatus.CREATED,
        message: new UserDto(user),
      };
    } catch (error) {
      console.log(error);
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
      const user = await this.prismaDynamic.create(TABLES.ADMIN, data);
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

  async updateUser(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      let user: UserData;

      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId },
      });
      if (user) {
        var updatedData = await this.prismaDynamic.update(TABLES.USER, {
          where: { userId },
          data,
        });
      } else {
        user = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
          where: { userId },
        });

        var updatedData = await this.prismaDynamic.update(TABLES.ADMIN, {
          where: { userId },
          data,
        });
      }

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

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

  async deleteUser(userId: string) {
    try {
      let user: UserData;

      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId },
      });
      if (user) {
        await this.prismaDynamic.delete(TABLES.USER, {
          where: { userId },
        });
      } else {
        user = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
          where: { userId },
        });

        await this.prismaDynamic.delete(TABLES.ADMIN, {
          where: { userId },
        });
      }

      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
