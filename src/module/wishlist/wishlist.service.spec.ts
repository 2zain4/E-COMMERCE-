import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { getModelToken } from '@nestjs/mongoose';
import { Wishlist } from '../../database/models/wishlist.model';

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getModelToken(Wishlist.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
