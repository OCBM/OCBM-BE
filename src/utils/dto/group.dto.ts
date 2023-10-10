import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GROUP_PERMISSIONS } from '@/common';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsEnum(GROUP_PERMISSIONS, { each: true })
  permissions: GROUP_PERMISSIONS[];

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;
}

export class UpdateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  groupname?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsArray()
  @IsEnum(GROUP_PERMISSIONS, { each: true })
  permissions?: GROUP_PERMISSIONS[];
}

export class GroupDto {
  groupId: string;

  groupName: string;

  role: string;

  permissions: string[];

  createdAt?: Date;

  updatedAt?: Date;

  constructor(partial: Partial<GroupDto>) {
    Object.assign(this, partial);
  }
}

export class GroupResponseDto {
  statusCode: number;

  @Type(() => GroupDto)
  message: GroupDto;

  constructor(partial: Partial<GroupResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GroupsResponseDto {
  statusCode: number;

  @Type(() => GroupDto)
  message: GroupDto[];

  constructor(partial: Partial<GroupResponseDto>) {
    Object.assign(this, partial);
  }
}
