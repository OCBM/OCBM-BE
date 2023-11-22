import {
  CreateMachineDto,
  MachineResponseDto,
  RolesGuard,
  UpdateMachineDto,
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
import { MachineService } from '@/services/machine/machine.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { PrismaService } from '@/services';
import { IsEnum } from 'class-validator';

@ApiTags('Machine')
@Controller('machine')
export class MachineController {
  [x: string]: any;
  constructor(
    private readonly machineService: MachineService,
    private readonly prismaDynamic: PrismaService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  async createMachine(@Body() machineData: CreateMachineDto) {
    const data = {
      ...machineData,
      machineLine: {
        connect: {
          machineLineId: machineData.machineLineId,
        },
      },
    };
    let machineLine: any;
    machineLine = await this.prismaDynamic.findUnique(TABLES.MACHINELINE, {
      where: { machineLineId: data.machineLineId },
    });
    if (!machineLine) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        Error: 'MachineLine not Exists',
      };
    } else {
      delete data.machineLineId;
      const result = await this.machineService.createMachine(data);
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
  async getAllMachines(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: Sort,
  ): Promise<MachineResponseDto> {
    return this.machineService.getAllMachines(page, limit, sort);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  @Get('/machineLineId=:machineLineId')
  async getAllMachine(
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
  ): Promise<MachineResponseDto> {
    return this.machineService.getAllMachine(machineLineId);
  }

  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  @Get('/machineId=:machineId&machineLineId=:machineLineId')
  async getMachineBymachineLineId(
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
    @Param('machineId', ParseUUIDPipe) machineId: string,
  ): Promise<MachineResponseDto> {
    return this.machineService.getMachineBymachineLineId(
      machineLineId,
      machineId,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  @Put('/machineLineId=:machineLineId&machineId=:machineId')
  async updateMachine(
    @Body() machineData: UpdateMachineDto,
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
    @Param('machineId', ParseUUIDPipe) machineId: string,
  ): Promise<MachineResponseDto> {
    return this.machineService.updateMachine(machineLineId, machineId, {
      ...machineData,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Delete('/machineLineId=:machineLineId&machineId=:machineId')
  @ApiParam({
    name: 'machineLineId',
    required: true,
  })
  @ApiParam({
    name: 'machineId',
    required: true,
  })
  async deleteMachine(
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
    @Param('machineId', ParseUUIDPipe) machineId: string,
  ) {
    return this.machineService.deleteMachine(machineLineId, machineId);
  }
}
