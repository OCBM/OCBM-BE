import {
  CreateMachineLineDto,
  MachineLineResponseDto,
  RolesGuard,
  UpdateMachineLineDto,
} from '@/utils';
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Delete,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MachineLineService } from '@/services/machineLine/machineLine.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { PrismaService } from '@/services';
import { IsEnum } from 'class-validator';

@ApiTags('MachineLine')
@Controller('machineLine')
export class MachineLineController {
  [x: string]: any;
  constructor(
    private readonly machineLineService: MachineLineService,
    private readonly prismaDynamic: PrismaService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  async createMachineLine(@Body() machineLineData: CreateMachineLineDto) {
    const data = {
      ...machineLineData,
      shop: {
        connect: {
          shopId: machineLineData.shopId,
        },
      },
    };
    let shop: any;
    shop = await this.prismaDynamic.findUnique(TABLES.SHOP, {
      where: { shopId: data.shopId },
    });
    if (!shop) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        Error: 'Shop not Exists',
      };
    } else {
      delete data.shopId;
      const result = await this.machineLineService.createMachineLine(data);
      return result;
    }
  }

  @ApiBearerAuth('access-token')
  @ApiQuery({
    name: 'sort',
    enum: Sort,
    required: true,
  })
  @IsEnum(Sort)
  @Get('/')
  async getAllMachineLine(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: Sort,
  ): Promise<MachineLineResponseDto> {
    return this.machineLineService.getAllMachineLine(page, limit, sort);
  }
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @Get('/shopId=:shopId')
  async getAllMachineLines(
    @Param('shopId', ParseUUIDPipe) shopId: string,
  ): Promise<MachineLineResponseDto> {
    return this.machineLineService.getAllMachineLines(shopId);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  @Get('/machineLineId=:machineLineId&shopId=:shopId')
  async getMachineLineByShopId(
    @Param('shopId', ParseUUIDPipe) shopId: string,
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
  ): Promise<MachineLineResponseDto> {
    return this.machineLineService.getMachineLineByShopId(
      shopId,
      machineLineId,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  @Put('/shopId=:shopId&machineLineId=:machineLineId')
  async updateMachineLine(
    @Body() machineLineData: UpdateMachineLineDto,
    @Param('shopId', ParseUUIDPipe) shopId: string,
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
  ): Promise<MachineLineResponseDto> {
    return this.machineLineService.updateMachineLine(shopId, machineLineId, {
      ...machineLineData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/shopId=:shopId&machineLineId=:machineLineId')
  @ApiParam({
    name: 'shopId',
    required: true,
  })
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  async deleteMachineLine(
    @Param('shopId', ParseUUIDPipe) shopId: string,
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
  ) {
    return this.machineLineService.deleteMachineLine(shopId, machineLineId);
  }
}
