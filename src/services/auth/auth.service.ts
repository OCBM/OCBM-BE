import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '@/utils/dto';
import { TOKEN_SECRET, TABLES, APP_CONSTANTS } from '@/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaDynamic: PrismaService,
  ) {}

  async login(loginData: LoginDto) {
    const { userName, password } = loginData;
    let user: any;

    user = await this.prismaDynamic.findUnique(TABLES.ADMIN, {
      where: { userName },
      include: {
        groups: true,
      },
    });

    if (!user) {
      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userName },
        include: {
          groups: true,
        },
      });
    }

    if (!user) {
      throw new HttpException(
        APP_CONSTANTS.USERNAME_OR_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(
        APP_CONSTANTS.USERNAME_OR_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      userId: user.userId,
      userName: user.userName,
      name: user.name,
      email: user.email,
      sub: user.userId,
      clientId: 'Omnex',
      role: user.role,
    };

    const token = this.jwtService.sign(
      { payload },
      { privateKey: TOKEN_SECRET.accessToken },
    );
    return {
      statusCode: HttpStatus.OK,
      message: {
        userId: user.userId,
        name: user.name,
        userName: user.userName,
        email: user.email,
        role: user.role,
        accessToken: token,
        groups: user.groups,
      },
    };
  }

  async validateUser(payload: any): Promise<any> {
    if (payload.payload.role === 'ADMIN') {
      return this.prismaDynamic.findUnique(TABLES.ADMIN, {
        where: { userId: payload.payload.userId },
      });
    } else if (payload.payload.role === 'USER') {
      return this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId: payload.payload.userId },
      });
    }
  }
}
