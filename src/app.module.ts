import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController, UserController } from './controllers';
import { AuthModule } from './modules';
import { AuthService, PrismaService, UserService } from './services';
import { JwtStrategy } from './utils';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    UserService,
    JwtService,
    JwtStrategy,
  ],
})
export class AppModule {}
