import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { CatsService } from './cats.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CatsService', () => {
  let service: CatsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService, PrismaService],
    }).compile();

    service = module.get<CatsService>(CatsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('create', async () => {
    const breed = {
      id: 1,
      name: 'Munchkin',
      description: 'Short legs and playful.',
    };
    const input = {
      name: 'Mochi',
      age: 1,
      breedId: breed.id,
    };
    const result = {
      id: 1,
      ...input,
      breed,
    };

    const createSpy = jest
      .spyOn(prisma.cat, 'create')
      .mockResolvedValue(result);

    await expect(service.create(input)).resolves.toEqual(result);

    expect(createSpy).toHaveBeenCalledWith({
      data: input,
      include: { breed: true },
    });
  });

  it('update', async () => {
    const breed = {
      id: 2,
      name: 'Ragdoll',
      description: 'Gentle and affectionate.',
    };
    const input = {
      id: 1,
      name: 'Luna',
      age: 3,
      breedId: breed.id,
    };
    const result = {
      ...input,
      breed,
    };

    const updateSpy = jest
      .spyOn(prisma.cat, 'update')
      .mockResolvedValue(result);

    await expect(service.update(input)).resolves.toEqual(result);

    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: input.id },
      data: input,
      include: { breed: true },
    });
  });

  it('update: not found resource', async () => {
    const input = {
      id: 99,
      name: 'Luna',
      age: 3,
      breedId: 2,
    };

    jest.spyOn(prisma.cat, 'update').mockRejectedValue(
      new PrismaClientKnownRequestError('Not Found', {
        code: 'P2025',
        clientVersion: 'test',
      }),
    );

    await expect(service.update(input)).resolves.toBeNull();
  });

  it('delete', async () => {
    const breed = {
      id: 3,
      name: 'Siberian',
      description: 'Thick coat and hardy.',
    };
    const result = {
      id: 1,
      name: 'Poppy',
      age: 4,
      breedId: breed.id,
      breed,
    };

    const deleteSpy = jest
      .spyOn(prisma.cat, 'delete')
      .mockResolvedValue(result);

    await expect(service.delete(1)).resolves.toEqual(result);

    expect(deleteSpy).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { breed: true },
    });
  });

  it('delete: not found resource', async () => {
    jest.spyOn(prisma.cat, 'delete').mockRejectedValue(
      new PrismaClientKnownRequestError('Not Found', {
        code: 'P2025',
        clientVersion: 'test',
      }),
    );

    await expect(service.delete(999)).resolves.toBeNull();
  });

  it('findAll', async () => {
    const breed = {
      id: 1,
      name: 'Siamese',
      description: 'Known for their blue eyes.',
    };
    const results = [
      {
        id: 1,
        name: 'Kitty',
        age: 2,
        breedId: breed.id,
        breed,
      },
    ];

    jest.spyOn(prisma.cat, 'findMany').mockResolvedValue(results);

    await expect(service.findAll()).resolves.toEqual(results);
  });

  it('findOne', async () => {
    const breed = {
      id: 1,
      name: 'Siamese',
      description: 'Known for their blue eyes.',
    };
    const result = {
      id: 1,
      name: 'Kitty',
      age: 2,
      breedId: breed.id,
      breed,
    };

    const findUniqueSpy = jest
      .spyOn(prisma.cat, 'findUnique')
      .mockResolvedValue(result);

    await expect(service.findOne(1)).resolves.toEqual(result);

    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { breed: true },
    });
  });
});
