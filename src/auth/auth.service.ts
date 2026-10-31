import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

type SafeUser = {
  id: number;
  username: string;
  nickname?: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<SafeUser> {
    const res = await this.prisma.customer.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        nickname: true,
      },
    });

    if (!res) throw new UnauthorizedException('账号或密码错误');
    const user = res;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('账号或密码错误');

    const { password: _pw, ...safe } = user;

    return safe;
  }

  login(user: SafeUser) {
    const payload = { sub: user.id, username: user.username };
    return {
      code: 0,
      data: {
        token: this.jwt.sign(payload),
        user: { id: user.id, username: user.username, nickname: user.nickname },
      },
    };
  }
}
