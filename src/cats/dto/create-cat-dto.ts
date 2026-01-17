import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateCatDto {
  @ApiProperty({
    description: 'The name of a cat',
    example: 'Whiskers',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The age of a cat',
    example: 3,
    minimum: 1,
    maximum: 9999,
  })
  @IsNumber()
  @Min(1)
  @Max(9999)
  age: number;

  @ApiProperty({
    description: 'The breed of a cat',
    example: 'Siamese',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  breed: string;
}
