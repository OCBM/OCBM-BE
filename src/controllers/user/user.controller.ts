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
  ParseIntPipe,
  ParseEnumPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { IsEnum } from 'class-validator';
import { PrismaValidation, Role, saltRounds } from '@/common';
import { Public, Roles } from '@/decorator';
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
  @ApiParam({
    name: 'role',
    enum: Role,
    required: true,
  })
  @IsEnum(Role)
  @Get('/:id/role=:role')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(id, role);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/create')
  async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
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

  // @Public()
  // @ApiBearerAuth('access-token')
  // @Post('/create-admin')
  // async createAdmin(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
  //   return this.userService.createAdmin({
  //     ...userData,
  //     password: hashedPassword,
  //   });
  // }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @IsEnum(Role)
  @ApiParam({
    name: 'role',
    required: true,
    enum: Role,
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Put('/:id/role=:role')
  async updateUser(
    @Body() userData: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<UserResponseDto> {
    if (role === Role.ADMIN) {
      return this.userService.updateAdmin(id, userData);
    } else if (role === Role.USER) {
      return this.userService.updateUser(id, userData);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/:id/role=:role')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @IsEnum(Role)
  @ApiParam({
    name: 'role',
    required: true,
    enum: Role,
  })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('role') role: Role,
  ) {
    if (role === Role.ADMIN) {
      return this.userService.deleteAdmin(id);
    } else if (role === Role.USER) {
      return this.userService.deleteUser(id);
    }
  }
}
