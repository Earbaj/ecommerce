import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // রিভিউ দেওয়ার জন্য লগইন থাকতে হবে
  @UseGuards(AuthGuard('jwt'))
  @Post(':productId')
  async addReview(
    @Param('productId') productId: string,
    @Body() body: { rating: number; comment: string },
    @Req() req
  ) {
    return this.reviewsService.createReview(req.user.userId, productId, body.rating, body.comment);
  }

  // যেকোনো ইউজার রিভিউ দেখতে পারবে
  @Get(':productId')
  async getReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }
}