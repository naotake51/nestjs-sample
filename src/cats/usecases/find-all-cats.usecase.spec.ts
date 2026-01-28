import { Test, TestingModule } from '@nestjs/testing';
import { FindAllCatsUsecase } from './find-all-cats.usecase';
import { PrismaService } from '../../prisma/prisma.service';

describe('FindAllCatsUsecase', () => {
  let usecase: FindAllCatsUsecase;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindAllCatsUsecase, PrismaService],
    }).compile();

    usecase = module.get<FindAllCatsUsecase>(FindAllCatsUsecase);
    prisma = module.get<PrismaService>(PrismaService);
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

    await expect(usecase.execute()).resolves.toEqual(results);
  });
});
