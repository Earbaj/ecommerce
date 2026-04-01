import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createOrder(userId: string, address: string) {
    // ১. ইউজারের কার্ট খুঁজে বের করা
    const cart = await this.cartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // ২. স্টক চেক করা (Stock Validation)
    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(`Product ${product?.title || 'Unknown'} is out of stock or insufficient!`);
      }
    }

    // ৩. অর্ডার অবজেক্ট তৈরি করা
    const newOrder = new this.orderModel({
      userId,
      items: cart.items,
      totalAmount: cart.totalPrice,
      address,
    });

    const savedOrder = await newOrder.save();

    // ৪. স্টক কমিয়ে ফেলা (Stock Reduction)
    for (const item of cart.items) {
      await this.productModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity } // মাইনাস করে স্টক কমানো
      });
    }

    // ৫. অর্ডার হয়ে গেলে কার্ট খালি করে দেওয়া
    await this.cartModel.findOneAndDelete({ userId });

    return savedOrder;
  }

  async getMyOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }
}