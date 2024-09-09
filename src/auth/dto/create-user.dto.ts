import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    default: 'test@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    minLength: 6,
    default: 'testtest',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
