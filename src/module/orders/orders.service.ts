import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from '../../database/models/order.model';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot place an order with an empty cart');
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress: createOrderDto.shippingAddress,
      phoneNumber: createOrderDto.phoneNumber,
      paymentMethod: createOrderDto.paymentMethod || 'cash',
    });

    const savedOrder = await order.save();
    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async getUserOrders(userId: string) {
    return await this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('items.productId');
  }

  async getAllOrders() {
    return await this.orderModel
      .find()
      .populate('userId', 'name email')
      .populate('items.productId');
  }

  async getOrderById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'name email')
      .populate('items.productId');
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (updateOrderStatusDto.status) {
      order.status = updateOrderStatusDto.status;
    }

    if (updateOrderStatusDto.isPaid !== undefined) {
      order.isPaid = updateOrderStatusDto.isPaid;
      order.paidAt = updateOrderStatusDto.isPaid ? new Date() : undefined;
    }

    if (updateOrderStatusDto.isDelivered !== undefined) {
      order.isDelivered = updateOrderStatusDto.isDelivered;
      order.deliveredAt = updateOrderStatusDto.isDelivered
        ? new Date()
        : undefined;
    }

    return await order.save();
  }
}
