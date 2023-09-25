import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/utils/dto/auth.dto';
import { User as UserModel } from '@prisma/client';
import { PrismaValidation, Role } from '@/common/enum';
import { IsEnum } from 'class-validator';
import { Roles } from 'src/decorator';
import { UserService } from '@/services';
import { bcrypt } from '@/packages';
import { RolesGuard } from '@/utils';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/create')
  async createUser(@Body() userData: UserDto): Promise<UserModel> {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
      if (userData.role === 'ADMIN') {
        const result = await this.userService.createAdmin({
          ...userData,
          password: hashedPassword,
        });
        return result;
      } else if (userData.role === 'USER') {
        const result = await this.userService.createUser({
          ...userData,
          password: hashedPassword,
        });
        return result;
      }
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

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Get('/profile')
  async getOwnProfile(@Request() req) {
    const result = await this.userService.getOwnProfile(req.user);
    return result;
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async getProfilebyId(@Param() param) {
    const result = await this.userService.getProfilebyId(param.id);
    return result;
  }
  @ApiBearerAuth('access-token')
  @Get('/get-all-users/role=:role')
  @IsEnum(Role)
  @ApiParam({
    name: 'role',
    required: true,
    enum: Role,
  })
  async getallUsers(@Param() param) {
    const result = await this.userService.getAllUsers(param.role);
    return result;
  }

  @ApiBearerAuth('access-token')
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deleteUser(@Param() param) {}
}
