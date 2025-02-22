import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestUser } from 'src/types/request';
import { compare, hash } from 'src/utils/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ success: boolean }> {
    const user = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hash(createUserDto.password);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    await createdUser.save();

    return { success: true };
  }

  signIn(user: RequestUser): { accessToken: string; user: RequestUser } {
    const payload = { email: user.email, sub: user.id, id: user.id, name: user.name };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<Pick<UserDocument, 'id' | 'email' | 'name'> | null> {
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (user && (await compare(user.password, password))) {
      const { email, name, _id } = user.toObject();
      return { id: _id.toString(), email, name };
    }

    return null;
  }
}
