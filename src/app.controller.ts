import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/decorator';

@ApiTags('API Status Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Omnex backend server status',
  })
  @Get()
  status(): string {
    return this.appService.status();
  }
}
