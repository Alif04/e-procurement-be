import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }
}
