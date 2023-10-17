import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { createServiceDto } from './groupServices.dto';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ApiProperty({ type: createServiceDto, isArray: true })
  @IsNotEmpty()
  services: createServiceDto[];

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
  groupName?: string;

  @ApiProperty({ type: createServiceDto, isArray: true })
  @IsNotEmpty()
  @IsOptional()
  services: createServiceDto[];
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
