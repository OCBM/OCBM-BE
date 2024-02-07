import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  sensorDescription?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sensorLabel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageKey?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName?: string;

  @ApiProperty()
  elements?: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  elementId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  constructor(partial: Partial<SensorDto>) {
    Object.assign(this, partial);
  }
}

export class CreateSensorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sensorDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sensorLabel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageKey: string;

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
  @IsNotEmpty()
  @IsOptional()
  sensorDescription?: string;

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
  @IsNotEmpty()
  @IsOptional()
  sensorLabel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
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

export class SenorDtoForSensorPage {
  image: string;
  sensorDescription: string;
  senorId: string;
}

export class SensorResponseDtoForSensorPage {
  statusCode: number;

  @Type(() => SenorDtoForSensorPage)
  message?: SenorDtoForSensorPage[];
  Error?: string;
  meta?: any;

  constructor(partial: Partial<SensorResponseDtoForSensorPage>) {
    Object.assign(this, partial);
  }
}
