import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, HydratedDocument } from 'mongoose';
import { Cart } from '../../database/models/cart.model';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!cart) {
      cart = new this.cartModel({
        userId: new Types.ObjectId(userId),
        items: [],
        totalPrice: 0,
      });
      await cart.save();
    }
    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity = 1 } = addToCartDto;
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getCart(userId);
    const prodIdObj = new Types.ObjectId(productId);
    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(prodIdObj),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: prodIdObj,
        quantity,
        price: product.price,
      });
    }

    this.calculateTotalPrice(cart);
    return await cart.save();
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cart = await this.getCart(userId);
    const prodIdObj = new Types.ObjectId(productId);
    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(prodIdObj),
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items[itemIndex].quantity = updateCartItemDto.quantity;
    this.calculateTotalPrice(cart);
    return await cart.save();
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    const prodIdObj = new Types.ObjectId(productId);
    cart.items = cart.items.filter((item) => !item.productId.equals(prodIdObj));
    this.calculateTotalPrice(cart);
    return await cart.save();
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.totalPrice = 0;
    return await cart.save();
  }

  private calculateTotalPrice(cart: HydratedDocument<Cart>) {
    cart.totalPrice = cart.items.reduce(
      (total: number, item) => total + item.price * item.quantity,
      0,
    );
  }
}
