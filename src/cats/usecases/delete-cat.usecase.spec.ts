import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { DeleteCatUsecase } from './delete-cat.usecase';
import { PrismaService } from '../../prisma/prisma.service';

describe('DeleteCatUsecase', () => {
  let usecase: DeleteCatUsecase;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteCatUsecase, PrismaService],
    }).compile();

    usecase = module.get<DeleteCatUsecase>(DeleteCatUsecase);
    prisma = module.get<PrismaService>(PrismaService);
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

    await expect(usecase.execute(1)).resolves.toEqual(result);

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

    await expect(usecase.execute(999)).resolves.toBeNull();
  });
});
