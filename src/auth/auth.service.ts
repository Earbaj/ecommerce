import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // ১. সাইনআপ লজিক
  async signup(userData: any) {
    const { email, password } = userData;
    
    // ইমেইল অলরেডি আছে কি না চেক করা
    const userExists = await this.userModel.findOne({ email });
    if (userExists) throw new BadRequestException('Email already exists');

    // পাসওয়ার্ড হ্যাশ করা (Security)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }

  // ২. লগইন লজিক
  async login(loginData: any) {
    const { email, password } = loginData;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT টোকেন তৈরি (পেলোড এ ইউজার আইডি এবং রোল থাকে)
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}