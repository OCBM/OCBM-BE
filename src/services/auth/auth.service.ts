import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@/utils/dto';
import { PrismaService } from '../prisma/prisma.service';
import { jwtSecret } from '@/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    const { username, password, role } = loginData;
    let user: any;
    user = await this.prismaService.admin.findUnique({
      where: { username, role },
    });
    if (!user) {
      user = await this.prismaService.user.findUnique({
        where: { username, role },
      });
    }
    if (!user) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      userid: user.userid,
      username: user.username,
      email: user.email,
      sub: user.userid,
      clientId: 'Omnex',
      role: user.role,
    };

    const token = this.jwtService.sign({ payload }, { privateKey: jwtSecret });
    return {
      statusCode: HttpStatus.OK,
      message: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token,
      },
    };
  }

  async validateUser(payload: any): Promise<any> {
    if (payload.payload.role === 'ADMIN') {
      return this.prismaService.admin.findUnique({
        where: { userid: payload.payload.userid },
      });
    } else if (payload.payload.role === 'USER') {
      return this.prismaService.user.findUnique({
        where: { userid: payload.payload.userid },
      });
    }
  }
}
