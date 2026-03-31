import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop([{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true } // কার্টে যোগ করার সময়কার প্রাইস
  }])
  items: { productId: string; quantity: number; price: number }[];

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);