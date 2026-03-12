import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, userSchema } from '../user/schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),

    // JWT এর জন্য Async কনফিগারেশন 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // এখানে 'as string' যোগ করুন যাতে টাইপ এরর না আসে
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // expiresIn কে নির্দিষ্টভাবে টাইপ কাস্টিং করে দিন
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }