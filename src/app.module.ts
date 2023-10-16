import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import {
  AuthController,
  OrganizationController,
  PlantController,
  ShopController,
  UserController,
} from './controllers';
import { AuthModule, GroupModule } from './modules';
import {
  AuthService,
  OrganizationService,
  PlantService,
  PrismaService,
  ShopService,
  UserService,
} from './services';
import { JwtStrategy } from './utils';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, GroupModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    OrganizationController,
    PlantController,
    ShopController,
  ],
  providers: [
    PrismaService,
    AppService,
    AuthService,
    UserService,
    OrganizationService,
    JwtService,
    JwtStrategy,
    PlantService,
    ShopService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
