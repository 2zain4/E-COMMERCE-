import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  productId!: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
