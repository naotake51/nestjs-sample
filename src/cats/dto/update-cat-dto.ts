import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class UpdateCatDto {
  @ApiProperty({
    description: 'The name of a cat',
    example: 'Whiskers',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly name: string;

  @ApiProperty({
    description: 'The age of a cat',
    example: 3,
    minimum: 1,
    maximum: 9999,
  })
  @IsInt()
  @Min(1)
  @Max(9999)
  readonly age: number;

  @ApiProperty({
    description: 'The breed ID of a cat',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  readonly breedId: number;
}
