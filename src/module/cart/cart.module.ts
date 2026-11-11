import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from '../../database/models/cart.model';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService, MongooseModule],
})
export class CartModule {}
