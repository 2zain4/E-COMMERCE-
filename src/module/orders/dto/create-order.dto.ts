import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingAddress!: string;

  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsEnum(['cash', 'card'])
  paymentMethod?: string;
}
