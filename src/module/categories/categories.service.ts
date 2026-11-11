import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../../database/models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const exist = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (exist) {
      throw new ConflictException('Category with this name already exists');
    }
    const category = new this.categoryModel(createCategoryDto);
    return await category.save();
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (updateCategoryDto.name) {
      const exist = await this.categoryModel.findOne({
        name: updateCategoryDto.name,
        _id: { $ne: id },
      });
      if (exist) {
        throw new ConflictException('Category with this name already exists');
      }
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.image) {
      category.image = updateCategoryDto.image;
    }
    return await category.save();
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryModel.findByIdAndDelete(id);
    return { message: 'Category deleted successfully', category };
  }
}
