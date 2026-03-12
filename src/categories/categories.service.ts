import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(createCategoryDto:CreateCategoryDto) {
    const { name, parentId } = createCategoryDto;
    const slug = name.toLowerCase().replace(/ /g, '-');
    
    const exists = await this.categoryModel.findOne({ slug });
    if (exists) throw new BadRequestException('Category already exists');

    const createData: any = { name, slug };
    if (parentId !== null) {
      createData.parentId = parentId;
    }
    return await this.categoryModel.create(createData);
  }

  async findAll() {
    const categories = await this.categoryModel.find().exec();
    return this.buildTree(categories);
  }

  // ক্যাটাগরিগুলোকে গাছ (Tree) আকারে সাজানোর লজিক
  private buildTree(categories: any[], parentId = null) {
    const categoryList: any[] = [];
    let filterCats = categories.filter(cat => String(cat.parentId) === String(parentId));

    if (parentId === null) {
      filterCats = categories.filter(cat => cat.parentId === null);
    }

    for (let cat of filterCats) {
      categoryList.push({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        children: this.buildTree(categories, cat._id) // এটি নিজে নিজেকে কল করবে (Recursion)
      });
    }
    return categoryList;
  }
}