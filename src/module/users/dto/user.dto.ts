import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../../../common/enum/role.enum';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class addUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name!: string;
  @IsEmail()
  email!: string;
  @IsStrongPassword({ minLength: 6 })
  password!: string;
  @IsNumber()
  age!: number;
  @IsPhoneNumber('EG')
  phone!: string;
  @IsEnum(RoleEnum)
  @IsString()
  role!: string;
  @IsEnum(GenderEnum)
  @IsString()
  gender!: string;
}
