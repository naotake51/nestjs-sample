import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCatDto } from './create-cat-dto';

describe('CreateCatDto validation', () => {
  const basePayload = {
    name: 'Mochi',
    age: 2,
    breed: 'Munchkin',
  };

  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateCatDto, basePayload);

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe('name', () => {
    it('rejects an empty name', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        name: '',
      });

      const errors = await validate(dto);
      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError?.constraints?.minLength).toBe(
        'name must be longer than or equal to 1 characters',
      );
    });

    it('accepts a max-length name', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        name: 'a'.repeat(255),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects an overlong name', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        name: 'a'.repeat(256),
      });

      const errors = await validate(dto);
      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError?.constraints?.maxLength).toBe(
        'name must be shorter than or equal to 255 characters',
      );
    });

    it('rejects a non-string name', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        name: 123,
      });

      const errors = await validate(dto);
      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError?.constraints?.isString).toBe('name must be a string');
    });
  });

  describe('age', () => {
    it('accepts a min age', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        age: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('accepts a max age', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        age: 9999,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects an age below minimum', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        age: 0,
      });

      const errors = await validate(dto);
      const ageError = errors.find((error) => error.property === 'age');
      expect(ageError?.constraints?.min).toBe('age must not be less than 1');
    });

    it('rejects an age above maximum', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        age: 10000,
      });

      const errors = await validate(dto);
      const ageError = errors.find((error) => error.property === 'age');
      expect(ageError?.constraints?.max).toBe(
        'age must not be greater than 9999',
      );
    });

    it('rejects a non-number age', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        age: '2',
      });

      const errors = await validate(dto);
      const ageError = errors.find((error) => error.property === 'age');
      expect(ageError?.constraints?.isNumber).toBe(
        'age must be a number conforming to the specified constraints',
      );
    });
  });

  describe('breed', () => {
    it('accepts a max-length breed', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        breed: 'a'.repeat(255),
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('rejects an empty breed', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        breed: '',
      });

      const errors = await validate(dto);
      const breedError = errors.find((error) => error.property === 'breed');
      expect(breedError?.constraints?.minLength).toBe(
        'breed must be longer than or equal to 1 characters',
      );
    });

    it('rejects an overlong breed', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        breed: 'a'.repeat(256),
      });

      const errors = await validate(dto);
      const breedError = errors.find((error) => error.property === 'breed');
      expect(breedError?.constraints?.maxLength).toBe(
        'breed must be shorter than or equal to 255 characters',
      );
    });

    it('rejects a non-string breed', async () => {
      const dto = plainToInstance(CreateCatDto, {
        ...basePayload,
        breed: 123,
      });

      const errors = await validate(dto);
      const breedError = errors.find((error) => error.property === 'breed');
      expect(breedError?.constraints?.isString).toBe('breed must be a string');
    });
  });
});
