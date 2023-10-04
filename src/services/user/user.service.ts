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
import { PrismaService } from '../prisma/prisma.service';
import { UserData } from '@/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async getOwnProfile(user: TokenType): Promise<UserResponseDto> {
    let userDetails: UserData;
    if (user.role === Role.ADMIN) {
      userDetails = await this.prismaDynamic.findUnique('admin', {
        where: { userid: user.userid },
        include: {
          groups: true,
          organization: true,
          plants: true,
        },
      });
    } else if (user.role === Role.USER) {
      userDetails = await this.prismaDynamic.findUnique('user', {
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
    let users: UserData[];
    if (role === Role.ADMIN) {
      users = await this.prismaDynamic.findMany('admin', {
        include: {
          groups: true,
          organization: true,
          plants: true,
        },
      });
    } else if (role === Role.USER) {
      users = await this.prismaDynamic.findMany('user', {
        include: {
          groups: true,
          organizations: true,
          plants: true,
        },
      });
    } else if (role === Role.SUPERADMIN) {
      throw new HttpException(
        'Super Admin not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: users.map((user: UserData) => new UserDto(user)),
    };
  }

  async getUserById(userid: string): Promise<UserResponseDto> {
    let user: UserData;

    user = await this.prismaDynamic.findUnique('admin', {
      where: { userid },
      include: {
        groups: true,
        organization: true,
        plants: true,
      },
    });
    if (!user) {
      user = await this.prismaDynamic.findUnique('user', {
        where: { userid },
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
      user = await this.prismaDynamic.findUnique('admin', {
        where: { username },
      });

      if (!user) {
        user = await this.prismaDynamic.findUnique('user', {
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
      const user = await this.prismaDynamic.create('user', data);
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
      const user = await this.prismaDynamic.create('admin', data);
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
    userid: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      let user: UserData;

      user = await this.prismaDynamic.findUnique('user', {
        where: { userid },
      });
      if (user) {
        var updatedData = await this.prismaDynamic.update('user', {
          where: { userid },
          data,
        });
      } else {
        user = await this.prismaDynamic.findUnique('admin', {
          where: { userid },
        });

        var updatedData = await this.prismaDynamic.update('admin', {
          where: { userid },
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

  async deleteUser(userid: string) {
    try {
      let user: UserData;

      user = await this.prismaDynamic.findUnique('user', {
        where: { userid },
      });
      if (user) {
        await this.prismaDynamic.delete('user', {
          where: { userid },
        });
      } else {
        user = await this.prismaDynamic.findUnique('admin', {
          where: { userid },
        });

        await this.prismaDynamic.delete('admin', {
          where: { userid },
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
      console.log(error, 'hello');

      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
