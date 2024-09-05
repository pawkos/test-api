import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
    default: 'test',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    default: 'test',
  })
  @IsNotEmpty()
  password: string;
}
  