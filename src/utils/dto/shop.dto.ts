import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ShopDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}

export class CreateShopDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  plantId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  plants: any;
}

export class UpdateShopDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  shopName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;
}

export class ShopResponseDto {
  statusCode: number;

  @Type(() => ShopDto)
  message?: ShopDto;
  Error?: string;

  constructor(partial: Partial<ShopResponseDto>) {
    Object.assign(this, partial);
  }
}
