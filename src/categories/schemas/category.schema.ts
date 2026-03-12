import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string; // URL ফ্রেন্ডলি নাম (যেমন: 'smart-phones')

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null })
  parentId: string; // যদি সাব-ক্যাটাগরি হয়, তবে প্যারেন্টের আইডি এখানে থাকবে
}

export const CategorySchema = SchemaFactory.createForClass(Category);