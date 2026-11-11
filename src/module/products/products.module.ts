import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './../../database/models/product.model';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: productSchema,
      },
    ]),
  ],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
