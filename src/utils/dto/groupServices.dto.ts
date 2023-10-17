import { GROUP_PERMISSIONS } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class createServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @ApiProperty({ isArray: true })
  @IsNotEmpty()
  @IsEnum(GROUP_PERMISSIONS, { each: true })
  permissions: GROUP_PERMISSIONS[];
}
