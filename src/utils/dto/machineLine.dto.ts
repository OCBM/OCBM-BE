import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MachineLineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineLineId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineLineName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineLineDescription: string;

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
  shopId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateMachineLineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineLineName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  machineLineDescription: string;

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
  shopId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  shops: any;
}

export class UpdateMachineLineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineLineName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  machineLineDescription: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageName: string;
}

export class MachineLineResponseDto {
  statusCode: number;

  @Type(() => MachineLineDto)
  message?: MachineLineDto;
  Error?: string;

  constructor(partial: Partial<MachineLineResponseDto>) {
    Object.assign(this, partial);
  }
}
