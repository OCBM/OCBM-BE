import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@/utils/dto';
import { jwtSecret } from '@/common';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaDynamic: PrismaService,
  ) {}

  async login(loginData: LoginDto) {
    const { username, password, role } = loginData;
    let user: any;

    user = await this.prismaDynamic.findUnique('admin',{
      where: { username, role },
    });
   
    if (!user) {
      user = await this.prismaDynamic.findUnique('user',{
        where: { username, role },
      });
    }
    if (!user) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
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
      return this.prismaDynamic.findUnique('admin',{
        where: { userid: payload.payload.userid },
      });
    } else if (payload.payload.role === 'USER') {
      return this.prismaDynamic.findUnique('user',{
        where: { userid: payload.payload.userid },
      });
    }
  }
}
