import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId()
  orderId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsOptional()
  paymentGateway?: string;

  @IsString()
  paymentId!: string;

  @IsEnum(['pending', 'success', 'failed'])
  status!: string;
}
