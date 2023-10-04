import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizationid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizationname: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizationname: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class UpdateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  organizationname?: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}

export class OrganizationResponseDto {
  statusCode: number;

  @Type(() => OrganizationDto)
  message: OrganizationDto;

  constructor(partial: Partial<OrganizationResponseDto>) {
    Object.assign(this, partial);
  }
}
