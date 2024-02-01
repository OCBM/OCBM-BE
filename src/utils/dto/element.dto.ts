import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ElementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementDescription: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageKey: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateElementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementDescription: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageKey: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imageName: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  machineId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  machines: any;
}

export class UpdateElementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  elementName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  elementDescription?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageKey?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imageName?: string;
}

export class ElementResponseDto {
  statusCode: number;

  @Type(() => ElementDto)
  message?: ElementDto;
  Error?: string;
  meta?: any;

  constructor(partial: Partial<ElementResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ElementResponseDtoForGetByPlantId {
  statusCode: number;

  @Type(() => ElementDto)
  message?: ElementDto[];
  Error?: string;
  meta?: any;

  constructor(partial: Partial<ElementResponseDto>) {
    Object.assign(this, partial);
  }
}
