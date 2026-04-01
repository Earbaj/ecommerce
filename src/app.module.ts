import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // ১. ConfigModule লোড করা
    ConfigModule.forRoot({
      isGlobal: true, // যাতে সব মডিউলে বারবার ইমপোর্ট করতে না হয়
    }),

    // ২. Async ভাবে Mongoose কানেক্ট করা
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule, AuthModule, CategoriesModule, ProductsModule, CartModule, OrdersModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
