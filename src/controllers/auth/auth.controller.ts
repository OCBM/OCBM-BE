import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '@/decorator';
import { AuthService } from '@/services';
import { LoginDto } from '@/utils/dto';

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
          username: 'abineshprabhakaran',
          password: 'Abinesh@2023',
        } as LoginDto,
      },
    },
  })
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
}
