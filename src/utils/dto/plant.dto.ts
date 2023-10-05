import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

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
  plantname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class UpdatePlantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  plantname?: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;
}

export class PlantResponseDto {
  statusCode: number;

  @Type(() => PlantDto)
  message: PlantDto;

  constructor(partial: Partial<PlantResponseDto>) {
    Object.assign(this, partial);
  }
}
