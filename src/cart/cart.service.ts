import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async addToCart(userId: string, productId: string, quantity: number) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      // যদি কার্ট না থাকে তবে নতুন তৈরি হবে
      cart = new this.cartModel({ userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // আইটেম অলরেডি থাকলে কোয়ান্টিটি আপডেট
      cart.items[itemIndex].quantity += quantity;
    } else {
      // নতুন আইটেম যোগ করা
      cart.items.push({ productId, quantity, price: product.price });
    }

    // টোটাল প্রাইস ক্যালকুলেট করা
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return await cart.save();
  }

  async getCart(userId: string) {
    return this.cartModel.findOne({ userId }).populate('items.productId', 'title images');
  }
}