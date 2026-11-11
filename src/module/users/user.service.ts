import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addUserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../../database/models/user.model';
import { deleteUserDto } from './dto/delete.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  userModel: Model<User>;
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    this.userModel = userModel;
  }

  async getAllUsers() {
    const data = await this.userModel.find().select('-password');
    return data;
  }

  async addUser(data: addUserDto) {
    const { email, password } = data;
    const existUser = await this.userModel
      .findOne({ email: email })
      .select('_id');
    if (existUser) {
      throw new ConflictException('User already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    const createdUser = await this.userModel.create({
      ...data,
      password: hashed,
    });
    const userObj = createdUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const existUser = await this.userModel.findOne({
        email: data.email,
        _id: { $ne: id },
      });
      if (existUser) {
        throw new ConflictException('Email already in use');
      }
      user.email = data.email;
    }

    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    if (data.name) user.name = data.name;
    if (data.age) user.age = data.age;
    if (data.phone) user.phone = data.phone;
    if (data.role) user.role = data.role;
    if (data.gender) user.gender = data.gender;

    const updated = await user.save();
    const userObj = updated.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }

  async deleteUser(data: deleteUserDto) {
    const { id } = data;
    const existUser = await this.userModel.findOne({ _id: id });
    if (!existUser) {
      throw new ConflictException('User not found');
    }
    const deleted = await this.userModel.findByIdAndDelete({ _id: id });
    return { message: 'User deleted successfully', user: deleted };
  }
}
