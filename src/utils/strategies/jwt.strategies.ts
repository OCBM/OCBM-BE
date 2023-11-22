import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_SECRET } from '@/common';
import { AuthService } from '@/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authservice: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: TOKEN_SECRET.accessToken,
    });
  }

  async validate(payload: any) {
    const user = await this.authservice.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
