import {
  ConflictException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../database/models/user.model';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    this.userModel = userModel;
    this.jwtService = jwtService;
  }
  async signup(createAuthDto: CreateAuthDto) {
    const exists = await this.userModel.findOne({ email: createAuthDto.email });
    if (exists) {
      throw new ConflictException('User already exists');
    }
    const created = await this.userModel.create(createAuthDto);
    const user = created.toObject();
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      access_token: this.jwtService.sign({ id: created._id }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = {
      id: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
