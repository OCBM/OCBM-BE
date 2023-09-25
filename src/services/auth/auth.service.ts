import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from 'src/utils/dto/auth.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '@/common';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(
    loginData: LoginDto,
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginData.username, role: loginData.role },
    });
    const admin = await this.prisma.admin.findUnique({
      where: { username: loginData.username, role: loginData.role },
    });
    if (!user && !admin) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      !admin ? user.password : admin.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    !admin ? (user.password = undefined) : (admin.password = undefined);
    const payload = {
      userid: !admin ? user.userid : admin.userid,
      username: !admin ? user.username : admin.username,
      email: !admin ? user.email : admin.email,
      sub: !admin ? user.userid : admin.userid,
      clientId: 'Omnex',
      role: !admin ? user.role : admin.role,
    };
    const token = this.jwtService.sign({ payload }, { privateKey: jwtSecret });
    return {
      statusCode: HttpStatus.OK,
      message: {
        userid: !admin ? user.userid : admin.userid,
        username: !admin ? user.username : admin.username,
        email: !admin ? user.email : admin.email,
        role: !admin ? user.role : admin.role,
        accessToken: token,
      },
    };
  }
  async validateUser(payload: any): Promise<any> {
    if (payload.payload.role === 'ADMIN') {
      return this.prisma.admin.findUnique({
        where: { userid: payload.payload.userid },
      });
    } else if (payload.payload.role === 'USER') {
      return this.prisma.user.findUnique({
        where: { userid: payload.payload.userid },
      });
    }
  }
}
