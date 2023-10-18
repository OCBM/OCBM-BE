import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { IsEnum } from 'class-validator';
import { Role, BCRYPT_SALT_ROUNDS } from '@/common';
import { Roles } from '@/decorator';
import { UserService } from '@/services';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UsersResponseDto,
} from '@/utils';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiBearerAuth('access-token')
  // @Get('/profile')
  // async getOwnProfile(@Req() request: Request | any): Promise<UserResponseDto> {
  //   return this.userService.getOwnProfile(request.user);
  // }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'role',
    enum: Role,
    required: true,
  })
  @IsEnum(Role)
  @Get('/:role')
  async getAllUsers(@Param('role') role: Role): Promise<UsersResponseDto> {
    try {
      return this.userService.getAllUsers(role);
    } catch (e) {
      console.log(e);
    }
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: CreateUserDto,
    examples: {
      admin: {
        summary: 'Create User demo',
        value: {
          userName: 'abinesh',
          name: 'Abinesh Prabhakaran',
          email: 'abinesh@gmail.com',
          employeeId: 'FEC123',
          position: 'Software Engineer',
          role: 'USER',
          groups: {
            connect: [{ groupId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' }],
          },
          organization: {
            connect: [
              { organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
            ],
          },
          plants: {
            connect: [
              { plantId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
            ],
          },
          password: 'Abinesh@2023',
        } as CreateUserDto,
      },
    },
  })
  @Post('/')
  async createUser(@Body() userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      userData.password,
      BCRYPT_SALT_ROUNDS,
    );
    const isUserExits = await this.userService.CheckUsername({
      userName: userData.userName,
    });

    if (isUserExits) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    } else {
      if (userData.role === Role.ADMIN) {
        const result = await this.userService.createAdmin({
          ...userData,
          password: hashedPassword,
        });
        return result;
      } else if (userData.role === Role.USER) {
        const result = await this.userService.createUser({
          ...userData,
          password: hashedPassword,
        });
        return result;
      }
    }
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Put('/:id')
  async updateUser(
    @Body() userData: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, {
      ...userData,
      ...(userData.password && {
        password: await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS),
      }),
    });
  }

  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
