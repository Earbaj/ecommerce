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

  async findAll(query: any) {
  const { search, category, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'} = query;

  // ১. ফিল্টার অবজেক্ট তৈরি
  const filter: any = {};

  // সার্চ লজিক (Case-insensitive search)
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  // ক্যাটাগরি ফিল্টার
  if (category) {
    filter.category = category;
  }

  // দামের রেঞ্জ ফিল্টার (Min/Max)
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // ২. প্যাগিনেশন লজিক
  const skip = (Number(page) - 1) * Number(limit);

  // ৩. কুয়েরি এক্সিকিউট করা
  // সর্টিং অবজেক্ট তৈরি
  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? 1 : -1;

  const products = await this.productModel
    .find(filter)
    .populate('category', 'name slug')
    .limit(Number(limit))
    .skip(skip)
    .sort(sortOptions) // এখানে ডাইনামিক সর্ট হবে
    .exec();

  // মোট কয়টি প্রোডাক্ট আছে তা জানা (Frontend-এ প্যাগিনেশনের জন্য লাগে)
  const total = await this.productModel.countDocuments(filter);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    products,
  };
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

// প্রোডাক্ট আপডেট করা
async update(id: string, updateProductDto: any) {
  const product = await this.productModel.findById(id);
  if (!product) throw new NotFoundException('Product not found');

  // সিকিউরিটি: শুধুমাত্র যে এডমিন তৈরি করেছে সে বা সুপার এডমিন আপডেট করতে পারবে (অপশনাল)
  return await this.productModel.findByIdAndUpdate(id, updateProductDto, { returnDocument: 'after' }).exec();
}

// প্রোডাক্ট ডিলিট করা
async remove(id: string) {
  const result = await this.productModel.findByIdAndDelete(id).exec();
  if (!result) throw new NotFoundException('Product not found');
  return { message: 'Product deleted successfully' };
}

}