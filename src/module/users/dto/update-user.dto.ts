import { PartialType } from '@nestjs/mapped-types';
import { addUserDto } from './user.dto';

export class UpdateUserDto extends PartialType(addUserDto) {}
