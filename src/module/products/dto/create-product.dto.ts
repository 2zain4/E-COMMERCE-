import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productName!: string;

  @IsString()
  productCode!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
