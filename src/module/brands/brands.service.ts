import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from '../../database/models/brand.model';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const exist = await this.brandModel.findOne({ name: createBrandDto.name });
    if (exist) {
      throw new ConflictException('Brand with this name already exists');
    }
    const brand = new this.brandModel(createBrandDto);
    return await brand.save();
  }

  async findAll() {
    return await this.brandModel.find();
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    if (updateBrandDto.name) {
      const exist = await this.brandModel.findOne({
        name: updateBrandDto.name,
        _id: { $ne: id },
      });
      if (exist) {
        throw new ConflictException('Brand with this name already exists');
      }
      brand.name = updateBrandDto.name;
    }
    if (updateBrandDto.image) {
      brand.image = updateBrandDto.image;
    }
    return await brand.save();
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    await this.brandModel.findByIdAndDelete(id);
    return { message: 'Brand deleted successfully', brand };
  }
}
