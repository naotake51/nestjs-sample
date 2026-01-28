import { Test, TestingModule } from '@nestjs/testing';
import { FindCatUsecase } from './find-cat.usecase';
import { PrismaService } from '../../prisma/prisma.service';

describe('FindCatUsecase', () => {
  let usecase: FindCatUsecase;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindCatUsecase, PrismaService],
    }).compile();

    usecase = module.get<FindCatUsecase>(FindCatUsecase);
    prisma = module.get<PrismaService>(PrismaService);
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

    await expect(usecase.execute(1)).resolves.toEqual(result);

    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { breed: true },
    });
  });
});
