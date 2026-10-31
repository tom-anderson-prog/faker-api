import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

interface JwtPayload {
  sub: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;
    if (!auth || typeof auth !== 'string') {
      throw new UnauthorizedException('未登录');
    }
    const token = auth.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('未登录');
    try {
      const payload = this.jwt.verify<JwtPayload>(token);
      req.user = payload;
      return true;
    } catch (e) {
      // console.log('JWT verification failed: ', e);
      throw new UnauthorizedException('token 无效或已过期');
    }
  }
}
