import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleEnum } from '../../common/enum/role.enum';
import { GenderEnum } from '../../common/enum/gender.enum';
import { env } from '../../config/env.service';
import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
  strict: true,
})
export class User {
  @Prop({ type: String, required: true })
  name!: string;
  @Prop({ type: String, required: true, unique: true, trim: true })
  email!: string;
  @Prop({ type: String, required: true })
  password!: string;
  @Prop({ type: Number, required: true })
  age!: number;
  @Prop({ type: String, required: true })
  phone!: string;
  @Prop({ type: String, required: true })
  address!: string;
  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
  @Prop({ type: Boolean, default: false })
  verified!: boolean;
  @Prop({ type: Boolean, default: false })
  isBlocked!: boolean;
  @Prop({ type: String, default: RoleEnum.USER, enum: RoleEnum })
  role!: string;
  @Prop({ type: String, default: GenderEnum.MALE, enum: GenderEnum })
  gender!: string;
  @Prop({ type: Date, default: null })
  changeUserPasswordAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(env.salt));
  }
});
