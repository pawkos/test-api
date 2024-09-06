import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    type: 'string',
    required: true,
    default: 'test',
  })
  @IsNotEmpty()
  title: string;
}

export class UpdateTodoDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  isCompleted?: boolean;
}