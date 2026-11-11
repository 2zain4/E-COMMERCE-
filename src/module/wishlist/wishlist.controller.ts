import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorator/current-user.decorator';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  addToWishlist(
    @Body(new ValidationPipe()) addToWishlistDto: AddToWishlistDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.wishlistService.addToWishlist(userId, addToWishlistDto);
  }

  @Delete(':productId')
  removeFromWishlist(
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
