import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorator/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  addToCart(
    @Body(new ValidationPipe()) addToCartDto: AddToCartDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Patch(':productId')
  updateCartItem(
    @Param('productId') productId: string,
    @Body(new ValidationPipe()) updateCartItemDto: UpdateCartItemDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.cartService.updateCartItem(
      userId,
      productId,
      updateCartItemDto,
    );
  }

  @Delete(':productId')
  removeFromCart(
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete()
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
