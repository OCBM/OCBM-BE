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
  machineNumber: string;

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
  imageKey: string;

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
  @IsNotEmpty()
  machineNumber: string;

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
  @IsNotEmpty()
  @IsOptional()
  machineNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageKey: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  imageName: string;
}

export class MachineResponseDto {
  statusCode: number;

  @Type(() => MachineDto)
  message?: MachineDto;
  Error?: string;
  meta?: any;

  constructor(partial: Partial<MachineResponseDto>) {
    Object.assign(this, partial);
  }
}

export class MachineResponseDtoForGetByPlantId {
  statusCode: number;

  @Type(() => MachineDto)
  message?: MachineDto[];
  Error?: string;
  meta?: any;

  constructor(partial: Partial<MachineResponseDto>) {
    Object.assign(this, partial);
  }
}

export class MachineDtoForSetStandards {
  machineName: string;
  elementName: string;
  sensorDescription: string;
  senorId: string;
}

export class MachineResponseDtoForSetStandards {
  statusCode: number;

  @Type(() => MachineDtoForSetStandards)
  message?: MachineDtoForSetStandards[];
  Error?: string;
  meta?: any;

  constructor(partial: Partial<MachineResponseDtoForSetStandards>) {
    Object.assign(this, partial);
  }
}
