import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import {
  AuthController,
  MachineLineController,
  OrganizationController,
  PlantController,
  SensorController,
  ShopController,
  UserController,
} from './controllers';
import { AuthModule, GroupModule } from './modules';
import {
  AuthService,
  ElementService,
  MachineLineService,
  MachineService,
  OrganizationService,
  PlantService,
  PrismaService,
  SensorService,
  ShopService,
  UserService,
} from './services';
import { JwtStrategy } from './utils';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MachineController } from './controllers/machine/machine.controller';
import { ElementController } from './controllers/element/element.controller';

@Module({
  imports: [AuthModule, PrismaModule, GroupModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    OrganizationController,
    PlantController,
    ShopController,
    MachineLineController,
    MachineController,
    ElementController,
    SensorController,
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
    MachineLineService,
    MachineService,
    ElementService,
    SensorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
