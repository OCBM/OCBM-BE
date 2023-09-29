import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController, UserController } from './controllers';
import { AuthModule } from './modules';
import { AuthService, PrismaService, UserService } from './services';
import { JwtStrategy } from './utils';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AppController, AuthController, UserController],
  providers: [
    PrismaService,
    AppService,
    AuthService,
    UserService,
    JwtService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
