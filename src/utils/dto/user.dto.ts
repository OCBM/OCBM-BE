import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { Role } from '@/common';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Role)
  role: string;

  @IsNotEmpty()
  @ApiProperty()
  groups: any;

  @IsNotEmpty()
  @ApiProperty()
  organization: any;

  @IsNotEmpty()
  @ApiProperty()
  plants: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  position?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  groups?: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  organization?: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  plants?: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(8)
  password?: string;
}

export class UserDto {
  userName: string;

  name: string;

  email: string;

  employeeId: string;

  position: string;

  role: string;

  groups: any;

  organization: any;

  @Exclude()
  password: string;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class UserResponseDto {
  statusCode: number;

  count?: number;

  @Type(() => UserDto)
  message?: UserDto;
  Error?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UsersResponseDto {
  statusCode: number;

  count?: number;

  @Type(() => UserDto)
  message?: UserDto[];
  Error?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
