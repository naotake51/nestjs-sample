import { Test, TestingModule } from '@nestjs/testing';
import { FindBreedOptionsForCreateUsecase } from './find-breed-options-for-create.usecase';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

describe('FindBreedOptionsForCreateUsecase', () => {
  let usecase: FindBreedOptionsForCreateUsecase;
  let prisma: PrismaService;
  let breedSelectionRule: BreedSelectionRule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindBreedOptionsForCreateUsecase,
        PrismaService,
        BreedSelectionRule,
      ],
    }).compile();

    usecase = module.get<FindBreedOptionsForCreateUsecase>(
      FindBreedOptionsForCreateUsecase,
    );
    prisma = module.get<PrismaService>(PrismaService);
    breedSelectionRule = module.get<BreedSelectionRule>(BreedSelectionRule);
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

    await expect(usecase.execute()).resolves.toEqual(results);

    expect(findManySpy).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
    expect(canSelectForCreateSpy).toHaveBeenCalledTimes(results.length);
  });
});
