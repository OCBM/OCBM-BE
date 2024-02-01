import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Sort, TABLES, TokenType } from '@/common';
import { PrismaValidation, Role } from '@/common';
import {
  UpdateUserDto,
  UserDto,
  UserResponseDto,
  UsersResponseDto,
} from '@/utils';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserData, APP_CONSTANTS } from '@/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaDynamic: PrismaService) {}

  async getAllUsersbyToken(
    page: number = 1,
    limit: number = 10,
    search: string,
    sort: string,
    orgId: any,
  ): Promise<any> {
    let users: UserData[];
    try {
      users = await this.prismaDynamic.findMany(TABLES.USER, {
        include: {
          organization: true,
          plants: true,
        },
      });
      let filteredUsers: any = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );
      filteredUsers.sort((a, b) => {
        return sort === Sort.ASC
          ? a.createdAt - b.createdAt
          : b.createdAt - a.createdAt;
      });
      filteredUsers = filteredUsers.slice((page - 1) * limit, limit);
      return {
        statusCode: HttpStatus.OK,
        message: filteredUsers.map((user: UserData) => new UserDto(user)),
        meta: {
          current_page: page,
          item_count: limit,
          total_items: users.length,
          totalPage: Math.ceil(users.length / limit),
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getUsersbyToken(
    page: number = 1,
    limit: number = 10,
    search: string,
    sort: string,
    userdetails: any,
  ): Promise<any> {
    let users: any;
    console.log(userdetails, 'hello');
    try {
      users = await this.prismaDynamic.findUnique(TABLES.PLANT, {
        where: {
          plantId: userdetails.plants[0].plantId,
        },
        include: {
          users: true,
        },
      });
      let filteredUsers: any = users.users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );
      filteredUsers.sort((a, b) => {
        return sort === Sort.ASC
          ? a.createdAt - b.createdAt
          : b.createdAt - a.createdAt;
      });
      filteredUsers = filteredUsers.slice((page - 1) * limit, limit);
      return {
        statusCode: HttpStatus.OK,
        message: filteredUsers.map((user: UserData) => new UserDto(user)),
        meta: {
          current_page: page,
          item_count: limit,
          total_items: users.users.length,
          totalPage: Math.ceil(users.users.length / limit),
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  async getAllUserswithoutRole(
    page: number = 1,
    limit: number = 10,
    search: string,
    sort: string,
    orgId: any,
  ): Promise<UserResponseDto> {
    //console.log('orgId:', orgId);
    let checkOrganization: any;
    checkOrganization = await this.prismaDynamic.findUnique(TABLES.USER, {
      where: {
        userId: orgId.userId,
      },
      include: {
        organization: true,
        plants: true,
      },
    });

    // console.log(
    //   'organization:',
    //   checkOrganization.organization.filter(
    //     (data) => data.organizationName === 'Flyerssoft Private Limited',
    //   ),
    // );

    const getAllUsersWithOrganization = await this.prismaDynamic.findUnique(
      TABLES.ORGANIZATION,
      {
        include: {
          users: true,
        },
        where: {
          organizationId: checkOrganization.organization[0].organizationId,
        },
      },
    );
    // const admins = getAllUsersWithOrganization?.admins.map(admin => admin.userId)
    // const users = getAllUsersWithOrganization?.users.map(user => user.userId)
    const users = [...getAllUsersWithOrganization?.users];
    let filteredUsers: any = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
    filteredUsers.sort((a, b) => {
      return sort === Sort.ASC
        ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt;
    });
    filteredUsers = filteredUsers.slice((page - 1) * limit, limit);
    //console.log('getAllUsersWithOrganization', getAllUsersWithOrganization);
    // const countQuery: string = search.trim()
    //   ? `SELECT * FROM "Admin" WHERE name ILIKE $1 UNION ALL SELECT * from "User" WHERE name ILIKE $1`
    //   : `SELECT * FROM "Admin" UNION ALL SELECT * from "User"`;
    // const query: string = search.trim()
    //   ? `SELECT * FROM "Admin" WHERE name ILIKE $1 UNION ALL SELECT * from "User" WHERE name ILIKE $1 ORDER BY "createdAt" ${sort} LIMIT $3 OFFSET $4`
    //   : `SELECT * FROM "Admin" UNION ALL SELECT * from "User" ORDER BY "createdAt" ${sort} LIMIT $3 OFFSET $4 `;
    // console.log(query, sort);
    // const userDetails: any = await this.prismaDynamic.$queryRawUnsafe(
    //   query,
    //   `%${search.trim().replace(/"/g, '')}%`,
    //   sort,
    //   limit,
    //   (page - 1) * limit,
    // );
    // const totalCountDetails: any = await this.prismaDynamic.$queryRawUnsafe(
    //   countQuery,
    //   `%${search.trim().replace(/"/g, '')}%`,
    // );
    return {
      statusCode: HttpStatus.OK,
      message: filteredUsers.map(
        (userData: Partial<UserDto>) => new UserDto(userData),
      ),
      meta: {
        current_page: page,
        item_count: limit,
        total_items: users.length,
        totalPage: Math.ceil(users.length / limit),
      },
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
      throw new HttpException(
        APP_CONSTANTS.USER_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
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

    user = await this.prismaDynamic.findUnique(TABLES.USER, {
      where: { userId },
      include: {
        groups: true,
        organization: true,
        plants: true,
      },
    });

    if (!user) {
      throw new HttpException(
        APP_CONSTANTS.USER_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: new UserDto(user),
    };
  }

  async createSuperAdmin() {}

  async CheckUsername(data: any) {
    let user: UserData;
    const userName = data.userName;
    const emailId = data.email;

    try {
      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userName, emailId },
      });

      if (user) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
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
      if (error.response.code === PrismaValidation.ALREADY_EXITS) {
        throw new HttpException(
          APP_CONSTANTS.USER_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_CREATE_USER,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    userId: string,
    currentUser: any,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      let user: any;
      let canAdd = false;
      let userData: any = {
        ...data,
      };
      let updatedData: any;
      
      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId },
        include: {
          plants: true,
          organization: true,
          groups: true,
        },
      });
      if (user) {
        // if (user?.plants?.length && userData?.plants?.connect?.length) {
        //   userData = {
        //     ...userData,
        //     plants: {
        //       disconnect: user.plants.map((plant) => ({
        //         plantId: plant.plantId,
        //       })),
        //       ...userData.plants,
        //     },
        //   };
        // }
        if (user?.groups?.length && userData?.groups?.connect?.length) {
          userData = {
            ...userData,
            groups: {
              disconnect: user.groups.map((group) => ({
                groupId: group.groupId,
              })),
              ...userData.groups,
            },
          };
        }

        if (currentUser?.role === Role.USER && currentUser?.userId === userId) {
          canAdd = true;
        } else if (currentUser?.role === Role.ADMIN) {
          if (currentUser?.userId === userId || data.role === Role.USER) {
            canAdd = true;
          }
        } else if (currentUser?.role === Role.SUPERADMIN) {
          canAdd = true;
        }

        if (canAdd) {
          updatedData = await this.prismaDynamic.update(TABLES.USER, {
            where: { userId },
            data: userData,
          });
        } else {
          throw new HttpException(
            APP_CONSTANTS.PERMISSION_DENIED,
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        throw new HttpException(
          APP_CONSTANTS.USER_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      return new UserResponseDto({
        statusCode: HttpStatus.OK,
        message: new UserDto(updatedData),
      });
    } catch (error) {
      if (error?.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(
          APP_CONSTANTS.USER_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error?.status === HttpStatus.FORBIDDEN) {
        throw new HttpException(
          APP_CONSTANTS.PERMISSION_DENIED,
          HttpStatus.FORBIDDEN,
        );
      }
      if (error?.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException();
      }
      throw new HttpException(
        APP_CONSTANTS.FAILED_TO_UPDATE_USER,
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

      if (user === null) {
        throw new HttpException(
          APP_CONSTANTS.USER_NOT_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: APP_CONSTANTS.USER_DELETED_SUCCESSFULLY,
      };
    } catch (error) {
      console.log(error);
      if (
        error.response.code === PrismaValidation.RECORD_TO_DELETE_DOES_NOT_EXIST
      ) {
        throw new HttpException(
          APP_CONSTANTS.RECORD_TO_DELETE_DOES_NOT_EXIST,
          HttpStatus.BAD_REQUEST,
        );
        // if (error.response.code === PrismaValidation.FOREIGN_KEY) {
        //   throw new HttpException(
        //     APP_CONSTANTS.UNABLETODELETE,
        //     HttpStatus.BAD_REQUEST,
        //   );
      } else {
        throw new HttpException(
          APP_CONSTANTS.FAILED_TO_DELETE_USER,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
