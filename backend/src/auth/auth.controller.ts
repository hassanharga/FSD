import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { hash } from 'src/utils/hash';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { User } from './entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp({ ...createUserDto, password: await hash(createUserDto.password) });
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully signed in.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signIn(@Body() signInAuthDto: SignInAuthDto) {
    const { email, password } = signInAuthDto;
    return this.authService.signIn(email, password);
  }
}
