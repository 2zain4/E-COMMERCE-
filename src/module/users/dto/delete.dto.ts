import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class deleteUserDto {
  @IsMongoId()
  id!: Types.ObjectId;
}
