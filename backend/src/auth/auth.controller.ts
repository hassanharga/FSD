import { Body, Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { RequestUser } from 'src/types/request';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { User } from './entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Public()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully signed in.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: SignInAuthDto, required: true })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('signin')
  signIn(@Request() req: Req) {
    return this.authService.signIn(req.user as RequestUser);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'The user profile has been successfully retrieved.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('profile')
  getProfile(@Request() req: Req) {
    return req.user;
  }
}
