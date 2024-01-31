import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RefreshLoginDto } from '@/utils/dto';
import { TOKEN_SECRET, TABLES, APP_CONSTANTS, TOKEN_EXPIRY } from '@/common';
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
        organization: true,
      },
    });

    if (!user) {
      user = await this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userName },
        include: {
          groups: true,
          organization: true,
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
    console.log('UserDetails:', user);
    const payload = {
      userId: user.userId,
      userName: user.userName,
      name: user.name,
      email: user.email,
      sub: user.userId,
      clientId: 'Omnex',
      role: user.role,
      organization: user.organization[0].organizationId,
    };
    console.log('PayloadDetails:', payload);
    const accessToken = this.jwtService.sign(
      { payload: payload },
      {
        expiresIn: TOKEN_EXPIRY.accessToken,
        privateKey: TOKEN_SECRET.accessToken,
      },
    );
    // const token = this.jwtService.sign(
    //   { payload, expiresIn: TOKEN_EXPIRY.accessToken },
    //   { privateKey: TOKEN_SECRET.accessToken },
    // );
    //const decodedData = this.jwtService.decode(accessToken, { json: true });
    const refreshToken = this.jwtService.sign(
      { payload: payload },
      {
        expiresIn: TOKEN_EXPIRY.refreshToken,
        privateKey: TOKEN_SECRET.refreshToken,
      },
    );
    // console.log('decodedata:', decodedData);
    return {
      statusCode: HttpStatus.OK,
      message: {
        userId: user.userId,
        name: user.name,
        userName: user.userName,
        email: user.email,
        role: user.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
        groups: user.groups,
        organization: user.organization,
      },
    };
  }

  async refreshLogin(data: RefreshLoginDto) {
    console.log('refreshData:', data.token);
    // const data = refreshData;
    const decodedData: any = this.jwtService.decode(data.token, { json: true });
    console.log('decodedData:', decodedData);
    const payload = {
      userId: decodedData.payload.userId,
      userName: decodedData.payload.userName,
      name: decodedData.payload.name,
      email: decodedData.payload.email,
      sub: decodedData.payload.userId,
      clientId: 'Omnex',
      role: decodedData.payload.role,
      organization: decodedData.payload.organization,
    };

    console.log('payload:', payload);
    const accessToken = this.jwtService.sign(
      { payload: payload },
      {
        expiresIn: TOKEN_EXPIRY.accessToken,
        privateKey: TOKEN_SECRET.accessToken,
      },
    );

    return {
      statusCode: HttpStatus.OK,
      message: { accessToken },
    };
  }
  async validateUser(payload: any): Promise<any> {
    if (payload.payload.role === 'ADMIN') {
      return this.prismaDynamic.findUnique(TABLES.ADMIN, {
        where: { userId: payload.payload.userId },
        include: { organization: true },
      });
    } else if (payload.payload.role === 'USER') {
      return this.prismaDynamic.findUnique(TABLES.USER, {
        where: { userId: payload.payload.userId },
        include: { organization: true },
      });
    }
  }
}
