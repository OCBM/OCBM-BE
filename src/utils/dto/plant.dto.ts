import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreatePlantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  organizationId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  organizations: any;
}

export class UpdatePlantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  plantName?: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName: string;
}

export class PlantResponseDto {
  statusCode: number;

  @Type(() => PlantDto)
  message?: PlantDto;
  Error?: string;
  meta?: any;

  constructor(partial: Partial<PlantResponseDto>) {
    Object.assign(this, partial);
  }
}
