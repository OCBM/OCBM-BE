import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { IsEnum } from 'class-validator';
import { Role, saltRounds } from '@/common';
import { Roles } from '@/decorator';
import { UserService } from '@/services';
import {
  CreateUserDto,
  RolesGuard,
  UpdateUserDto,
  UserResponseDto,
  UsersResponseDto,
} from '@/utils';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('access-token')
  @Get('/profile')
  async getOwnProfile(@Req() request: Request | any): Promise<UserResponseDto> {
    return this.userService.getOwnProfile(request.user);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'role',
    enum: Role,
    required: true,
  })
  @IsEnum(Role)
  @Get('/get-all-users/role=:role')
  async getAllUsers(@Param('role') role: Role): Promise<UsersResponseDto> {
    return this.userService.getAllUsers(role);
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
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/create')
  async createUser(@Body() userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const isUserExits = await this.userService.CheckUsername({
      username: userData.username,
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
  @UseGuards(RolesGuard)
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
        password: await bcrypt.hash(userData.password, saltRounds),
      }),
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
