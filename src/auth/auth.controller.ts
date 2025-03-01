import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'This route will handle Google login' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'This route will handle Google redirect' };
  }
}
