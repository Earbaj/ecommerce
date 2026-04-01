import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  // ১. রিভিউ তৈরি করা
  async createReview(userId: string, productId: string, rating: number, comment: string) {
    const newReview = new this.reviewModel({
      userId,
      productId,
      rating,
      comment,
    });
    return await newReview.save();
  }

  // ২. একটি প্রোডাক্টের সব রিভিউ দেখা
  async getProductReviews(productId: string) {
    return this.reviewModel.find({ productId })
      .populate('userId', 'name email') // ইউজারের নাম ও ইমেইল দেখাবে
      .sort({ createdAt: -1 });
  }
}