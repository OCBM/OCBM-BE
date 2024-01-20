import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '@/decorator';
import { AuthService } from '@/services';
import { LoginDto, RefreshLoginDto } from '@/utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiBody({
    type: LoginDto,
    examples: {
      admin: {
        summary: 'Admin User',
        description: 'Default Admin User Credentials',
        value: {
          userName: 'abineshprabhakaran',
          password: 'Abinesh@2023',
        } as LoginDto,
      },
    },
  })
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Public()
  @Post('/refreshLogin')
  @ApiBody({
    type: RefreshLoginDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  async refreshLogin(@Body() loginData: RefreshLoginDto) {
    console.log('loginData', loginData);
    return this.authService.refreshLogin(loginData);
  }
}
