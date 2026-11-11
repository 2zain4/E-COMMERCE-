import { IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(['pending', 'processed', 'shipped', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelivered?: boolean;
}
