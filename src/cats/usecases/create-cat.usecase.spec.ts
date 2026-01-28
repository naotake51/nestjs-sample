import { Test, TestingModule } from '@nestjs/testing';
import { CreateCatUsecase } from './create-cat.usecase';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

describe('CreateCatUsecase', () => {
  let usecase: CreateCatUsecase;
  let prisma: PrismaService;
  let breedSelectionRule: BreedSelectionRule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateCatUsecase, PrismaService, BreedSelectionRule],
    }).compile();

    usecase = module.get<CreateCatUsecase>(CreateCatUsecase);
    prisma = module.get<PrismaService>(PrismaService);
    breedSelectionRule = module.get<BreedSelectionRule>(BreedSelectionRule);
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

    const findUniqueSpy = jest
      .spyOn(prisma.catBreed, 'findUnique')
      .mockResolvedValue(breed);

    const canSelectForCreateSpy = jest
      .spyOn(breedSelectionRule, 'canSelectForCreate')
      .mockReturnValue(true);

    const createSpy = jest
      .spyOn(prisma.cat, 'create')
      .mockResolvedValue(result);

    await expect(usecase.execute(input)).resolves.toEqual(result);

    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: breed.id },
    });

    expect(canSelectForCreateSpy).toHaveBeenCalledWith(breed);

    expect(createSpy).toHaveBeenCalledWith({
      data: input,
      include: { breed: true },
    });
  });
});
