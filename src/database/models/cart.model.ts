import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

@Schema({
  _id: false,
})
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity!: number;

  @Prop({ type: Number, required: true })
  price!: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({
  timestamps: true,
  strict: true,
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items!: CartItem[];

  @Prop({ type: Number, default: 0 })
  totalPrice!: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
