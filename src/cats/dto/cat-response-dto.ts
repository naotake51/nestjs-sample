import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CatBreedResponseDto {
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

  @ApiProperty({
    description: 'The description of a cat breed',
    example: 'Siamese cats are known for their slender bodies and blue eyes.',
    minLength: 1,
    maxLength: 1000,
  })
  @Expose()
  readonly description: string;
}

export class CatResponseDto {
  @ApiProperty({
    description: 'The unique identifier of a cat',
    example: 1,
  })
  @Expose()
  readonly id: number;

  @ApiProperty({
    description: 'The name of a cat',
    example: 'Whiskers',
    minLength: 1,
    maxLength: 255,
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    description: 'The age of a cat',
    example: 3,
    minimum: 1,
    maximum: 9999,
  })
  @Expose()
  readonly age: number;

  @ApiProperty({
    description: 'The breed ID of a cat',
    example: 1,
    minimum: 1,
  })
  @Expose()
  readonly breedId: number;

  @ApiProperty({
    description: 'The breed of a cat',
    type: CatBreedResponseDto,
  })
  @Expose()
  @Type(() => CatBreedResponseDto)
  readonly breed: CatBreedResponseDto;
}
