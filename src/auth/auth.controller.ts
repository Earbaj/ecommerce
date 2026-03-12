import { Controller, Post, Body, UseGuards, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt')) // এই গার্ডটি রুটটিকে লক করে দিল
  @Get('profile')
  getProfile(@Req() req) {
    // লগইন করা ইউজারের ইনফরমেশন এখন 'req.user' এ আছে
    return {
      message: "This is a protected route",
      user: req.user
    };
  }
}