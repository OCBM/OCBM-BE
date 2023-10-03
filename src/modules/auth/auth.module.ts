import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_EXPIRY, TOKEN_SECRET } from '@/common';
import { AuthController, UserController } from '@/controllers';
import { AuthService, UserService } from '@/services';
import { APP_GUARD } from '@nestjs/core';
import { GroupsGuard, JwtAuthGuard, RolesGuard } from '@/utils';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: TOKEN_SECRET.accessToken,
      signOptions: { expiresIn: TOKEN_EXPIRY.accessToken },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GroupsGuard,
    },
  ],
})
export class AuthModule {}
