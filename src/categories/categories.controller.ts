import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // আপাতত শুধু লগইন চেক করছি
  create(@Body() createCategoryDto:CreateCategoryDto) {
    // এখানে পরবর্তীতে আমরা Admin চেক করার গার্ড যোগ করব
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
}