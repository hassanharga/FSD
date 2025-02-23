import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestUser } from 'src/types/request';
import { compare, hash } from 'src/utils/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ success: boolean }> {
    this.logger.log(`Attempting to sign up user with email: ${createUserDto.email}`);
    const user = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (user) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hash(createUserDto.password);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    await createdUser.save();

    this.logger.log(`User with email ${createUserDto.email} successfully signed up`);
    return { success: true };
  }

  signIn(user: RequestUser): { accessToken: string; user: RequestUser } {
    this.logger.log(`User with email ${user.email} attempting to sign in`);
    const payload = { email: user.email, sub: user.id, id: user.id, name: user.name };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<Pick<UserDocument, 'id' | 'email' | 'name'> | null> {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (user && (await compare(user.password, password))) {
      const { email, name, _id } = user.toObject();
      this.logger.log(`User with email ${email} successfully validated`);
      return { id: _id.toString(), email, name };
    }

    this.logger.warn(`User with email ${email} failed validation`);
    return null;
  }
}
