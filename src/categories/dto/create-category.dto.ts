import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @IsOptional()
  @IsMongoId({ message: 'Invalid Parent Category ID' }) // নিশ্চিত করবে এটি একটি সঠিক MongoDB ID
  parentId?: string;
}