import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UpdateCatUsecase } from './update-cat.usecase';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

describe('UpdateCatUsecase', () => {
  let usecase: UpdateCatUsecase;
  let prisma: PrismaService;
  let breedSelectionRule: BreedSelectionRule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateCatUsecase, PrismaService, BreedSelectionRule],
    }).compile();

    usecase = module.get<UpdateCatUsecase>(UpdateCatUsecase);
    prisma = module.get<PrismaService>(PrismaService);
    breedSelectionRule = module.get<BreedSelectionRule>(BreedSelectionRule);
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

    await expect(usecase.execute(input)).resolves.toEqual(result);

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

    await expect(usecase.execute(input)).resolves.toBeNull();
  });
});
