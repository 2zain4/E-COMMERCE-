import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  strict: true,
})
export class Brand {
  @Prop({ type: String, required: true })
  name!: string;
  @Prop({ type: String, unique: true, trim: true })
  slug!: string;
  @Prop({ type: String, required: true, unique: true, trim: true })
  image!: string;
}
export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre('save', function () {
  if (this.isModified('name') && this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
});
