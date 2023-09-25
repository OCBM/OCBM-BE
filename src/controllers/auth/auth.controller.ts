import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Public } from 'src/decorator';
import { AuthService } from '@/services';
import { LoginDto } from '@/utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ) {
    const result = await this.authService.login(
      loginData,
      userWhereUniqueInput,
    );
    return result;
  }
}
