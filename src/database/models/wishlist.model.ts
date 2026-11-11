import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

@Schema({
  timestamps: true,
  strict: true,
})
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products!: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
