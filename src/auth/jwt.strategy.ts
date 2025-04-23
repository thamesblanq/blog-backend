import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('✅ JWT Strategy initialized with secret:', configService.get<string>('JWT_SECRET'));
  }

  async validate(payload: JwtPayload) {
    console.log('JWT payload received in strategy:', payload); // This will be used to validate the user
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}