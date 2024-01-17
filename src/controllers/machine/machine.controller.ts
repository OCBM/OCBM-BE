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
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { MachineService } from '@/services/machine/machine.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { AwsService, PrismaService } from '@/services';
import { IsEnum } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Machine')
@Controller('machine')
export class MachineController {
  [x: string]: any;
  constructor(
    private readonly machineService: MachineService,
    private readonly prismaDynamic: PrismaService,
    private readonly awsService: AwsService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      required: [
        'machineName',
        'machineDescription',
        'imageName',
        'machineLineId',
        'image',
      ],
      properties: {
        machineName: {
          type: 'string',
        },
        machineDescription: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        machineLineId: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createMachine(
    @Body() machineData: CreateMachineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imageData = await this.awsService.uploadFile(file, 'machines');
      if (!imageData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Unable to upload image',
        };
      }
      const image = imageData.Location;
      const imageKey = imageData.Key;
      const data = {
        ...machineData,
        image,
        imageKey,
        machineLine: {
          connect: {
            machineLineId: machineData.machineLineId,
          },
        },
      };
      let machineLine: any = {};
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
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        machineName: {
          type: 'string',
        },
        machineDescription: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('/machineLineId=:machineLineId&machineId=:machineId')
  async updateMachine(
    @Body() machineData: UpdateMachineDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('machineLineId', ParseUUIDPipe) machineLineId: string,
    @Param('machineId', ParseUUIDPipe) machineId: string,
  ): Promise<MachineResponseDto> {
    try {
      if (file) {
        const imageData = await this.awsService.uploadFile(file, 'machines');
        if (!imageData) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            Error: 'Unable to upload image',
          };
        }
        machineData.image = imageData.Location;
        machineData.imageKey = imageData.Key;
        if (machineData.image && machineData.imageKey) {
          const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
            where: {
              machineLineId: machineLineId,
              machineId: machineId,
            },
          });
          const result = machine.imageKey;
          if (result) {
            await this.awsService.deleteFile(result);
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              Error: 'Unable to fetch image-data from the Database',
            };
          }
        }
      }
      return this.machineService.updateMachine(machineLineId, machineId, {
        ...machineData,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
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
    const machine = await this.prismaDynamic.findUnique(TABLES.MACHINE, {
      where: {
        machineLineId: machineLineId,
        machineId: machineId,
      },
    });
    if (machine) {
      await this.awsService.deleteFile(machine.imageKey);
      return this.machineService.deleteMachine(machineLineId, machineId);
    } else {
      throw new HttpException(
        'Unable to delete due to Machine not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
