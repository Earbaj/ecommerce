import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addToCart(@Body() body: { productId: string; quantity: number }, @Req() req) {
    return this.cartService.addToCart(req.user.userId, body.productId, body.quantity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.userId);
  }
}