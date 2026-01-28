import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindBreedOptionsForUpdateUsecase } from './find-breed-options-for-update.usecase';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

describe('FindBreedOptionsForUpdateUsecase', () => {
  let usecase: FindBreedOptionsForUpdateUsecase;
  let prisma: PrismaService;
  let breedSelectionRule: BreedSelectionRule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindBreedOptionsForUpdateUsecase,
        PrismaService,
        BreedSelectionRule,
      ],
    }).compile();

    usecase = module.get<FindBreedOptionsForUpdateUsecase>(
      FindBreedOptionsForUpdateUsecase,
    );
    prisma = module.get<PrismaService>(PrismaService);
    breedSelectionRule = module.get<BreedSelectionRule>(BreedSelectionRule);
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

    await expect(usecase.execute(cat.id)).resolves.toEqual(results);

    expect(findCatSpy).toHaveBeenCalledWith({ where: { id: cat.id } });

    expect(findManySpy).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });

    expect(canSelectForUpdateSpy).toHaveBeenCalledTimes(results.length);
  });

  it('findBreedOptionsForUpdate: not found resource', async () => {
    jest.spyOn(prisma.cat, 'findUnique').mockResolvedValue(null);

    await expect(usecase.execute(1)).rejects.toBeInstanceOf(NotFoundException);
  });
});
