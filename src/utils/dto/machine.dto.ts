import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MachineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineDescription: string;

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
  machineLineId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateMachineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineDescription: string;

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
  machineLineId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  machineLines: any;
}

export class UpdateMachineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineDescription: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName: string;
}

export class MachineResponseDto {
  statusCode: number;

  @Type(() => MachineDto)
  message?: MachineDto;
  Error?: string;

  constructor(partial: Partial<MachineResponseDto>) {
    Object.assign(this, partial);
  }
}
