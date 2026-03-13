import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number; // ইনভেন্টরি ম্যানেজমেন্টের জন্য

  @Prop([{ type: String }]) // প্রোডাক্টের একাধিক ছবি থাকতে পারে
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: string; // কোন এডমিন এটি তৈরি করেছে
}

export const ProductSchema = SchemaFactory.createForClass(Product);