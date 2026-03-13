import { Controller, Post, Get, Body, UseGuards, Req, Param,UnauthorizedException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // প্রোডাক্ট অ্যাড করতে লগইন মাস্ট
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    console.log('Log from Controller - User Object:', req.user);

  if (!req.user || !req.user.userId) {
    throw new UnauthorizedException('User not found in request');
  }
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}