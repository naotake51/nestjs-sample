import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class CatResponseDto {
  @ApiProperty({
    description: 'The unique identifier of a cat',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of a cat',
    example: 'Whiskers',
    minLength: 1,
    maxLength: 255,
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: 'The age of a cat',
    example: 3,
    minimum: 1,
    maximum: 9999,
  })
  @Expose()
  age: number;

  @ApiProperty({
    description: 'The breed of a cat',
    example: 'Siamese',
    minLength: 1,
    maxLength: 255,
  })
  @Expose()
  breed: string;
}
