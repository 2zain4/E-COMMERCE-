import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist } from '../../database/models/wishlist.model';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private readonly wishlistModel: Model<Wishlist>,
  ) {}

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('products');
    if (!wishlist) {
      wishlist = new this.wishlistModel({
        userId: new Types.ObjectId(userId),
        products: [],
      });
      await wishlist.save();
    }
    return wishlist;
  }

  async addToWishlist(userId: string, addToWishlistDto: AddToWishlistDto) {
    const { productId } = addToWishlistDto;
    const wishlistObj = await this.wishlistModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    let wishlist = wishlistObj;
    if (!wishlist) {
      wishlist = new this.wishlistModel({
        userId: new Types.ObjectId(userId),
        products: [],
      });
    }

    const prodIdObj = new Types.ObjectId(productId);
    if (!wishlist.products.some((id) => id.equals(prodIdObj))) {
      wishlist.products.push(prodIdObj);
      await wishlist.save();
    }
    return await this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    const prodIdObj = new Types.ObjectId(productId);
    wishlist.products = wishlist.products.filter((id) => !id.equals(prodIdObj));
    await wishlist.save();
    return await this.getWishlist(userId);
  }
}
