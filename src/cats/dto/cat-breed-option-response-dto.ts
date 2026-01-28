import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatBreedOptionResponseDto {
  @ApiProperty({
    description: 'The unique identifier of a cat breed',
    example: 1,
  })
  @Expose()
  readonly id: number;

  @ApiProperty({
    description: 'The name of a cat breed',
    example: 'Siamese',
    minLength: 1,
    maxLength: 255,
  })
  @Expose()
  readonly name: string;
}
