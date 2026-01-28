import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { NotFoundException } from '@nestjs/common';
import { CatsService } from './cats.service';
import { PrismaService } from '../prisma/prisma.service';
import { BreedSelectionRule } from './breed-selection.rule';

describe('CatsService', () => {
  let service: CatsService;
  let prisma: PrismaService;
  let breedSelectionRule: BreedSelectionRule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService, PrismaService, BreedSelectionRule],
    }).compile();

    service = module.get<CatsService>(CatsService);
    prisma = module.get<PrismaService>(PrismaService);
    breedSelectionRule = module.get<BreedSelectionRule>(BreedSelectionRule);
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

  it('create', async () => {
    const breed = {
      id: 1,
      name: 'Munchkin',
      description:
        'Munchkin cats are known for their short legs and playful nature.',
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

    const canSelectForCreateSpy = jest
      .spyOn(breedSelectionRule, 'canSelectForCreate')
      .mockReturnValue(true);
    const findUniqueSpy = jest
      .spyOn(prisma.catBreed, 'findUnique')
      .mockResolvedValue(breed);
    const createSpy = jest
      .spyOn(prisma.cat, 'create')
      .mockResolvedValue(result);

    await expect(service.create(input)).resolves.toEqual(result);

    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: breed.id },
    });
    expect(canSelectForCreateSpy).toHaveBeenCalledWith(breed);
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

    const findUniqueSpy = jest
      .spyOn(prisma.catBreed, 'findUnique')
      .mockResolvedValue(breed);

    const canSelectForUpdateSpy = jest
      .spyOn(breedSelectionRule, 'canSelectForUpdate')
      .mockReturnValue(true);

    const updateSpy = jest
      .spyOn(prisma.cat, 'update')
      .mockResolvedValue(result);

    await expect(service.update(input)).resolves.toEqual(result);

    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: breed.id },
    });

    expect(canSelectForUpdateSpy).toHaveBeenCalledWith(breed, input);

    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: input.id },
      data: input,
      include: { breed: true },
    });
  });

  it('update: not found resource', async () => {
    const breed = {
      id: 2,
      name: 'Ragdoll',
      description: 'Gentle and affectionate.',
    };
    const input = {
      id: 99,
      name: 'Luna',
      age: 3,
      breedId: breed.id,
    };

    jest.spyOn(prisma.catBreed, 'findUnique').mockResolvedValue(breed);

    jest.spyOn(breedSelectionRule, 'canSelectForUpdate').mockReturnValue(true);

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

  it('findBreedOptionsForCreate', async () => {
    const results = [
      {
        id: 1,
        name: 'Munchkin',
        description: 'Short legs and playful.',
      },
      {
        id: 2,
        name: 'Siamese',
        description: 'Known for their blue eyes.',
      },
    ];

    const canSelectForCreateSpy = jest
      .spyOn(breedSelectionRule, 'canSelectForCreate')
      .mockReturnValue(true);
    const findManySpy = jest
      .spyOn(prisma.catBreed, 'findMany')
      .mockResolvedValue(results);

    await expect(service.findBreedOptionsForCreate()).resolves.toEqual(results);

    expect(findManySpy).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
    expect(canSelectForCreateSpy).toHaveBeenCalledTimes(results.length);
  });

  it('findBreedOptionsForUpdate', async () => {
    const cat = {
      id: 1,
      name: 'Kitty',
      age: 2,
      breedId: 1,
    };
    const results = [
      {
        id: 1,
        name: 'Munchkin',
        description: 'Short legs and playful.',
      },
      {
        id: 2,
        name: 'Siamese',
        description: 'Known for their blue eyes.',
      },
    ];

    const canSelectForUpdateSpy = jest
      .spyOn(breedSelectionRule, 'canSelectForUpdate')
      .mockReturnValue(true);

    const findCatSpy = jest
      .spyOn(prisma.cat, 'findUnique')
      .mockResolvedValue(cat);

    const findManySpy = jest
      .spyOn(prisma.catBreed, 'findMany')
      .mockResolvedValue(results);

    await expect(service.findBreedOptionsForUpdate(cat.id)).resolves.toEqual(
      results,
    );

    expect(findCatSpy).toHaveBeenCalledWith({ where: { id: cat.id } });

    expect(findManySpy).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });

    expect(canSelectForUpdateSpy).toHaveBeenCalledTimes(results.length);
  });

  it('findBreedOptionsForUpdate: not found resource', async () => {
    jest.spyOn(prisma.cat, 'findUnique').mockResolvedValue(null);

    await expect(service.findBreedOptionsForUpdate(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
