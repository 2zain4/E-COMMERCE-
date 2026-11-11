import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId!: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity!: number;

  @Prop({ type: Number, required: true })
  price!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: true,
  strict: true,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ type: Number, required: true })
  totalPrice!: number;

  @Prop({ type: String, required: true })
  shippingAddress!: string;

  @Prop({ type: String, required: true })
  phoneNumber!: string;

  @Prop({ type: String, enum: ['cash', 'card'], default: 'cash' })
  paymentMethod!: string;

  @Prop({ type: Boolean, default: false })
  isPaid!: boolean;

  @Prop({ type: Date })
  paidAt?: Date;

  @Prop({ type: Boolean, default: false })
  isDelivered!: boolean;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
