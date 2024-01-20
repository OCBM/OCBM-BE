import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { Public } from '@/decorator';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('Download')
@Controller('file-download')
export class StorageController {
  @Public()
  @Get('storage/:dir/:filename')
  @ApiParam({
    name: 'dir',
    required: true,
  })
  @ApiParam({
    name: 'filename',
    required: true,
  })
  async downloadFile(
    @Param('dir') dir: string,
    @Param('filename') filename: string,
  ) {
    const file = createReadStream(join(`storage/${dir}`, filename));
    return new StreamableFile(file);
  }
}
