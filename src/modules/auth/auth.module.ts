import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from '@/common';
import { AuthController, UserController, PlantController } from '@/controllers';
import { AuthService, UserService } from '@/services';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/utils';
import { PlantService } from '@/services/plant/plant.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController, UserController, PlantController],
  providers: [
    AuthService,
    UserService,
    PlantService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
