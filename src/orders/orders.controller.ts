import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  async checkout(@Body('address') address: string, @Req() req) {
    return this.ordersService.createOrder(req.user.userId, address);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-orders')
  async getMyOrders(@Req() req) {
    return this.ordersService.getMyOrders(req.user.userId);
  }
}