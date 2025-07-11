import { Injectable } from '@nestjs/common';
import { Strategy as JwtStrategyBase, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtConfig } from 'src/jwt.config';

interface JwtPayload {
  id: number;
  username: string;
  role_id: number;
  exp: number;
  [key: string]: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase, 'jwt') {
  constructor() {
    if (!JwtConfig.user_secret) {
      throw new Error('JWT secret is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConfig.user_secret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.id,
      username: payload.username,
      role_id: payload.role_id,
      expired: payload.exp,
    };
  }
}
