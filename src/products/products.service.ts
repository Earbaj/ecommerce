import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const newProduct = new this.productModel({
      ...createProductDto,
      createdBy: userId,
    });
    return await newProduct.save(); 
  }

  async findAll() {
    // .populate('category') দিলে ক্যাটাগরির সব ডিটেইলস চলে আসবে (যেমন রিলেশনাল ডাটাবেসে হয়)
    return await this.productModel.find().populate('category', 'name slug').exec();
  }

  async findOne(id: string) {
  const product = await this.productModel.findById(id)
    .populate('category', 'name slug')
    .populate('createdBy', 'email') // কোন এডমিন তৈরি করেছে তাও দেখা যাবে
    .exec();

  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  return product;
}
}