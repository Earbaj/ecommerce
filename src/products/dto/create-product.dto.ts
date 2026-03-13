import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsNotEmpty()
  @IsString()
  category: string; // ক্যাটাগরির ObjectId
}