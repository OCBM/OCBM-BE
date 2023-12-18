import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SensorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensor_Id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensorName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensorDescription?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateSensorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @ApiProperty()
  @IsString()
  //@IsNotEmpty()
  @IsOptional()
  sensorName?: string;

  @ApiProperty()
  @IsString()
  //@IsNotEmpty()
  @IsOptional()
  sensorDescription?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsOptional()
  imageName?: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  elementId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  elements: any;
}

export class UpdateSensorDto {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @IsOptional()
  // sensorId?: string;
  @ApiProperty()
  @IsString()
  //@IsNotEmpty()
  @IsOptional()
  sensorName?: string;

  @ApiProperty()
  @IsString()
 // @IsNotEmpty()
  @IsOptional()
  sensorDescription?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName?: string;
}

export class SensorResponseDto {
  statusCode: number;

  @Type(() => SensorDto)
  message?: SensorDto;
  Error?: string;
  meta?: any;

  constructor(partial: Partial<SensorResponseDto>) {
    Object.assign(this, partial);
  }
}
