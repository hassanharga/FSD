import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (user) {
      throw new ConflictException('User already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email, password }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
