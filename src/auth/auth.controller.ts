import { Body, Post, HttpCode, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: { username: string; password: string }) {
    const user = await this.auth.validateUser(dto.username, dto.password);
    return this.auth.login(user);
  }
}
