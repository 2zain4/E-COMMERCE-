import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  strict: true,
})
export class Category {
  @Prop({ type: String, required: true, unique: true })
  name!: string;

  @Prop({ type: String, unique: true, trim: true })
  slug!: string;

  @Prop({ type: String, required: true })
  image!: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function () {
  if (this.isModified('name') && this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
});
