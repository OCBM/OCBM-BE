import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@/common';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Role)
  role: string;
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  employeeid: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  position: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Role)
  role: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsOptional()
  CreatedAt: Date;

  @ApiProperty()
  @IsOptional()
  UpdatedAt: Date;
}
