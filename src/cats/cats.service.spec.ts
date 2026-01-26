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
    const input = {
      name: 'Mochi',
      age: 1,
      breed: 'Munchkin',
    };
    const result = {
      id: 1,
      ...input,
    };

    const createSpy = jest
      .spyOn(prisma.cat, 'create')
      .mockResolvedValue(result);

    await expect(service.create(input)).resolves.toEqual(result);

    expect(createSpy).toHaveBeenCalledWith({ data: input });
  });

  it('update', async () => {
    const input = {
      id: 1,
      name: 'Luna',
      age: 3,
      breed: 'Ragdoll',
    };
    const result = {
      ...input,
    };

    const updateSpy = jest
      .spyOn(prisma.cat, 'update')
      .mockResolvedValue(result);

    await expect(service.update(input)).resolves.toEqual(result);

    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: input.id },
      data: input,
    });
  });

  it('update: not found resource', async () => {
    const input = {
      id: 99,
      name: 'Luna',
      age: 3,
      breed: 'Ragdoll',
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
    const result = {
      id: 1,
      name: 'Poppy',
      age: 4,
      breed: 'Siberian',
    };

    const deleteSpy = jest
      .spyOn(prisma.cat, 'delete')
      .mockResolvedValue(result);

    await expect(service.delete(1)).resolves.toEqual(result);

    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: 1 } });
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
    const results = [
      {
        id: 1,
        name: 'Kitty',
        age: 2,
        breed: 'Siamese',
      },
    ];

    jest.spyOn(prisma.cat, 'findMany').mockResolvedValue(results);

    await expect(service.findAll()).resolves.toEqual(results);
  });

  it('findOne', async () => {
    const result = {
      id: 1,
      name: 'Kitty',
      age: 2,
      breed: 'Siamese',
    };

    const findUniqueSpy = jest
      .spyOn(prisma.cat, 'findUnique')
      .mockResolvedValue(result);

    await expect(service.findOne(1)).resolves.toEqual(result);

    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
