import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
  async createAdmin(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.admin.create({
      data,
    });
  }

  async getOwnProfile(payload: any) {
    const adminCheck = payload.role === 'ADMIN';
    if (adminCheck) {
      var result = await this.prisma.admin.findUnique({
        where: { userid: payload.userid },
      });
    } else {
      var result = await this.prisma.user.findUnique({
        where: { userid: payload.userid },
      });
    }
    return {
      stausCode: HttpStatus.OK,
      message: {
        userid: result.userid,
        username: result.username,
        name: result.name,
        email: result.email,
        position: result.position,
        role: result.role,
        employeeid: result.employeeid,
        CreatedAt: result.CreatedAt,
        UpdateAt: result.UpdatedAt,
      },
    };
  }

  async getProfilebyId(id: any) {
    const user = await this.prisma.user.findUnique({
      where: { userid: parseInt(id) },
    });
    const admin = await this.prisma.admin.findUnique({
      where: { userid: parseInt(id) },
    });
    if (!user && !admin) {
      throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: {
        userid: !admin ? user.userid : admin.userid,
        username: !admin ? user.username : admin.username,
        name: !admin ? user.name : admin.name,
        email: !admin ? user.email : admin.email,
        position: !admin ? user.position : admin.position,
        role: !admin ? user.role : admin.role,
        employeeid: !admin ? user.employeeid : admin.employeeid,
        CreatedAt: !admin ? user.CreatedAt : admin.CreatedAt,
        UpdateAt: !admin ? user.UpdatedAt : admin.UpdatedAt,
      },
    };
  }
  async getAllUsers(role: any) {
    if (role === 'ADMIN') {
      var result = await this.prisma.admin.findMany({
        where: { role: role },
      });
    } else if (role === 'USER') {
      var result = await this.prisma.user.findMany({
        where: { role: role },
      });
    } else if (role === 'SUPERADMIN') {
      throw new HttpException(
        'Super Admin not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      stausCode: HttpStatus.OK,
      message: {
        result,
      },
    };
  }

  async deleteUserbyId(id: any) {}
}
