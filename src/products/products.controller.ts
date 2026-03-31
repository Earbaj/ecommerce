import { Controller, Post, Get, Body, UseGuards, Req, Param, UnauthorizedException, Delete, Patch, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  // ১. ইমেজ আপলোড রুট (Admin Only)
  @Post('upload')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', { // 'image' হলো Postman-এ কী (Key) নাম
    storage: diskStorage({
      destination: './uploads', // ছবি কোথায় সেভ হবে
      filename: (req, file, cb) => {
        // ছবির একটি ইউনিক নাম তৈরি করা (যাতে একই নামের ছবি ওভাররাইট না হয়)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // শুধুমাত্র ছবি (jpg, jpeg, png) আপলোড করার অনুমতি দেওয়া
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 2 // সর্বোচ্চ ২ মেগাবাইট (2MB)
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not uploaded');
    }
    // আপলোড হওয়া ছবির পাথ (Path) রিটার্ন করা
    return {
      imageUrl: `/uploads/${file.filename}`, // এই লিঙ্কটি আমরা প্রোডাক্ট ক্রিয়েট/আপডেটে ব্যবহার করব
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // প্রোডাক্ট অ্যাড করতে লগইন মাস্ট
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    console.log('Log from Controller - User Object:', req.user);

    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not found in request');
    }
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }


  // আপডেট রুট (Admin Only)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  // ডিলিট রুট (Admin Only)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

}