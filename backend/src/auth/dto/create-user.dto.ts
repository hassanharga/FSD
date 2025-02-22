import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Hassan', description: 'The name of the user' })
  @MinLength(3)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'test@test.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'P@ssword1',
    description: 'The password of the user',
  })
  // password must match this requirements
  // Minimum length of 8 characters.
  // At least one letter.
  // At least one number.
  // At least one special chLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one letter, one number, and one special character',
  })
  @IsNotEmpty()
  readonly password: string;
}
