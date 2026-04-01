import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // --- CORS এনাবেল করুন ---
  app.enableCors({
    origin: 'http://localhost:3000', // আপনার Next.js অ্যাপের ইউআরএল
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // -------------------------
  // Swagger কনফিগারেশন
  const config = new DocumentBuilder()
    .setTitle('My API Title')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Swagger UI সেটআপ (endpoint: /api)
  SwaggerModule.setup('api', app, document);


  // --- এই অংশটি যোগ করুন ---
  // 'uploads' ফোল্ডারটিকে স্ট্যাটিক assets হিসেবে সেট করা
  // যাতে /uploads/imagename.jpg লিঙ্ক দিয়ে ছবি দেখা যায়
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // ইউআরএল-এর শুরুতে কী থাকবে
  });
  // -------------------------

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
