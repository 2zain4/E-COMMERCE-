import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  productName!: string;
  @Prop({ type: String, required: true, unique: true })
  productCode!: string;
  @Prop({ type: String, required: true })
  description!: string;
  @Prop({ type: Number, required: true })
  price!: number;
  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy!: Types.ObjectId;
}
export const productSchema = SchemaFactory.createForClass(Product);
