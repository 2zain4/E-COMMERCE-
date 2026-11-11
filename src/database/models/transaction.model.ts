import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Order } from './order.model';

@Schema({
  timestamps: true,
  strict: true,
})
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  orderId!: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount!: number;

  @Prop({ type: String, default: 'stripe' })
  paymentGateway!: string;

  @Prop({ type: String, required: true })
  paymentId!: string;

  @Prop({
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  })
  status!: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
