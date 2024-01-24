import { Role } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UserDtoForSeed {
  @IsNotEmpty()
  //@ApiProperty()
  @IsString()
  organizationName: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  //@ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  // @ApiProperty()
  @IsEnum(Role)
  role: string;

  //@ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Exclude()
  password: string;

  // @ApiProperty()
  @IsOptional()
  createdAt?: Date;

  //@ApiProperty()
  @IsOptional()
  updatedAt?: Date;
}

export class CreateOrganizationDtoForSeed {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  organizationName: string;
}
export class CreateUserDtoForSeed {
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Exclude()
  password: string;
}
export class UserSeedResponseDto {
  statusCode: number;

  @Type(() => UserDtoForSeed)
  message?: {
    organization: CreateOrganizationDtoForSeed;
    user: CreateUserDtoForSeed;
  };
  Error?: string;
  meta?: any;
  constructor(partial: Partial<UserSeedResponseDto>) {
    Object.assign(this, partial);
  }
}

export class SeedDto {
  @IsNotEmpty()
  @ApiProperty()
  organizationData: CreateOrganizationDtoForSeed;
  @IsNotEmpty()
  @ApiProperty()
  userData: CreateUserDtoForSeed;
}
