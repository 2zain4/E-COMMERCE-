import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../../database/models/transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      userId: new Types.ObjectId(userId),
      orderId: new Types.ObjectId(createTransactionDto.orderId),
    });
    return await transaction.save();
  }

  async getUserTransactions(userId: string) {
    return await this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('orderId');
  }

  async getAllTransactions() {
    return await this.transactionModel
      .find()
      .populate('userId', 'name email')
      .populate('orderId');
  }
}
