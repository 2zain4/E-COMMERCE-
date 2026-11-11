import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../../database/models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const exist = await this.productModel.findOne({
      productCode: createProductDto.productCode,
    });
    if (exist) {
      throw new ConflictException(
        'Product with this product code already exists',
      );
    }
    const createdProduct = new this.productModel({
      ...createProductDto,
      createdBy: new Types.ObjectId(userId),
    });
    return await createdProduct.save();
  }

  async findAll() {
    return await this.productModel.find().populate('createdBy', 'name email');
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('createdBy', 'name email');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto.productCode) {
      const exist = await this.productModel.findOne({
        productCode: updateProductDto.productCode,
        _id: { $ne: id },
      });
      if (exist) {
        throw new ConflictException(
          'Product with this product code already exists',
        );
      }
    }
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
        runValidators: true,
      })
      .populate('createdBy', 'name email');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product deleted successfully', product };
  }
}
