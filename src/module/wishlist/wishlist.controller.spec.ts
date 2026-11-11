import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { JwtService } from '@nestjs/jwt';

describe('WishlistController', () => {
  let controller: WishlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: {
            getWishlist: jest.fn(),
            addToWishlist: jest.fn(),
            removeFromWishlist: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
