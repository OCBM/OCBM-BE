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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { MachineLineService } from '@/services/machineLine/machineLine.service';
import { Roles } from '@/decorator';
import { Role, Sort, TABLES } from '@/common';
import { AwsService, PrismaService } from '@/services';
import { IsEnum } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('MachineLine')
@Controller('machineLine')
export class MachineLineController {
  [x: string]: any;
  constructor(
    private readonly machineLineService: MachineLineService,
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
      properties: {
        machineLineName: {
          type: 'string',
        },
        machineLineDescription: {
          type: 'string',
        },
        imageName: {
          type: 'string',
        },
        shopId: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createMachineLine(
    @Body() machineLineData: CreateMachineLineDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imageData = await this.awsService.uploadFile(file, 'machineLines');
      if (!imageData) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          Error: 'Unable to upload image',
        };
      }
      const image = imageData.Location;
      const data = {
        ...machineLineData,
        image,
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
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        Error: 'Unable to upload image',
      };
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
