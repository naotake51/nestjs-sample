import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { NotFoundException } from '@nestjs/common';
import { CreateCatUsecase } from './usecases/create-cat.usecase';
import { UpdateCatUsecase } from './usecases/update-cat.usecase';
import { DeleteCatUsecase } from './usecases/delete-cat.usecase';
import { FindAllCatsUsecase } from './usecases/find-all-cats.usecase';
import { FindCatUsecase } from './usecases/find-cat.usecase';
import { FindBreedOptionsForCreateUsecase } from './usecases/find-breed-options-for-create.usecase';
import { FindBreedOptionsForUpdateUsecase } from './usecases/find-breed-options-for-update.usecase';
import { PrismaModule } from '../prisma/prisma.module';
import { BreedSelectionRule } from './breed-selection.rule';

describe('CatsController', () => {
  let controller: CatsController;
  let createCatUsecase: CreateCatUsecase;
  let updateCatUsecase: UpdateCatUsecase;
  let deleteCatUsecase: DeleteCatUsecase;
  let findAllCatsUsecase: FindAllCatsUsecase;
  let findCatUsecase: FindCatUsecase;
  let findBreedOptionsForCreateUsecase: FindBreedOptionsForCreateUsecase;
  let findBreedOptionsForUpdateUsecase: FindBreedOptionsForUpdateUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CatsController],
      providers: [
        CreateCatUsecase,
        UpdateCatUsecase,
        DeleteCatUsecase,
        FindAllCatsUsecase,
        FindCatUsecase,
        FindBreedOptionsForCreateUsecase,
        FindBreedOptionsForUpdateUsecase,
        BreedSelectionRule,
      ],
    }).compile();

    createCatUsecase = module.get<CreateCatUsecase>(CreateCatUsecase);
    updateCatUsecase = module.get<UpdateCatUsecase>(UpdateCatUsecase);
    deleteCatUsecase = module.get<DeleteCatUsecase>(DeleteCatUsecase);
    findAllCatsUsecase = module.get<FindAllCatsUsecase>(FindAllCatsUsecase);
    findCatUsecase = module.get<FindCatUsecase>(FindCatUsecase);
    findBreedOptionsForCreateUsecase =
      module.get<FindBreedOptionsForCreateUsecase>(
        FindBreedOptionsForCreateUsecase,
      );
    findBreedOptionsForUpdateUsecase =
      module.get<FindBreedOptionsForUpdateUsecase>(
        FindBreedOptionsForUpdateUsecase,
      );

    controller = module.get<CatsController>(CatsController);
  });

  it('findAll', async () => {
    const breed = {
      id: 1,
      name: 'Siamese',
      description:
        'Siamese cats are known for their slender bodies and blue eyes.',
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

    const usecaseSpy = jest
      .spyOn(findAllCatsUsecase, 'execute')
      .mockResolvedValue(results);

    expect(await controller.findAll()).toEqual(results);

    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('findOne', async () => {
    const breed = {
      id: 1,
      name: 'Siamese',
      description:
        'Siamese cats are known for their slender bodies and blue eyes.',
    };
    const result = {
      id: 1,
      name: 'Kitty',
      age: 2,
      breedId: breed.id,
      breed,
    };

    const usecaseSpy = jest
      .spyOn(findCatUsecase, 'execute')
      .mockResolvedValue(result);

    expect(await controller.findOne(1)).toEqual(result);

    expect(usecaseSpy).toHaveBeenCalledWith(1);
    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('findOne: not found resource', async () => {
    const result = null;

    jest.spyOn(findCatUsecase, 'execute').mockResolvedValue(result);

    await expect(controller.findOne(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create', async () => {
    const createDto = {
      name: 'Mochi',
      age: 1,
      breedId: 1,
    };
    const breed = {
      id: 1,
      name: 'Munchkin',
      description:
        'Munchkin cats are known for their short legs and playful nature.',
    };
    const result = {
      id: 1,
      ...createDto,
      breed,
    };

    const usecaseSpy = jest
      .spyOn(createCatUsecase, 'execute')
      .mockResolvedValue(result);

    expect(await controller.create(createDto)).toEqual(result);

    expect(usecaseSpy).toHaveBeenCalledWith(createDto);
    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('update', async () => {
    const updateDto = {
      name: 'Luna',
      age: 3,
      breedId: 2,
    };
    const breed = {
      id: 2,
      name: 'Ragdoll',
      description:
        'Ragdoll cats are known for their blue eyes and docile temperament.',
    };
    const result = {
      id: 1,
      ...updateDto,
      breed,
    };

    const usecaseSpy = jest
      .spyOn(updateCatUsecase, 'execute')
      .mockResolvedValue(result);

    expect(await controller.update(1, updateDto)).toEqual(result);

    expect(usecaseSpy).toHaveBeenCalledWith({
      id: 1,
      ...updateDto,
    });
    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('update: not found resource', async () => {
    const updateDto = {
      name: 'Luna',
      age: 3,
      breedId: 2,
    };
    const result = null;

    jest.spyOn(updateCatUsecase, 'execute').mockResolvedValue(result);

    await expect(controller.update(1, updateDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove', async () => {
    const breed = {
      id: 3,
      name: 'Siberian',
      description: 'Siberian cats are known for their thick fur and agility.',
    };
    const result = {
      id: 1,
      name: 'Poppy',
      age: 4,
      breedId: breed.id,
      breed,
    };

    const usecaseSpy = jest
      .spyOn(deleteCatUsecase, 'execute')
      .mockResolvedValue(result);

    expect(await controller.remove(1)).toEqual(result);

    expect(usecaseSpy).toHaveBeenCalledWith(1);
    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('remove: not found resource', async () => {
    const result = null;

    jest.spyOn(deleteCatUsecase, 'execute').mockResolvedValue(result);

    await expect(controller.remove(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findCreateBreedOptions', async () => {
    const results = [
      {
        id: 1,
        name: 'Siamese',
      },
      {
        id: 2,
        name: 'Munchkin',
      },
    ];

    const usecaseSpy = jest
      .spyOn(findBreedOptionsForCreateUsecase, 'execute')
      .mockResolvedValue([
        {
          id: 1,
          name: 'Siamese',
          description:
            'Siamese cats are known for their slender bodies and blue eyes.',
        },
        {
          id: 2,
          name: 'Munchkin',
          description:
            'Munchkin cats are known for their short legs and playful nature.',
        },
      ]);

    expect(await controller.findCreateBreedOptions()).toEqual(results);

    expect(usecaseSpy).toHaveBeenCalledWith();
    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('findUpdateBreedOptions', async () => {
    const results = [
      {
        id: 1,
        name: 'Siamese',
      },
    ];

    const usecaseSpy = jest
      .spyOn(findBreedOptionsForUpdateUsecase, 'execute')
      .mockResolvedValue([
        {
          id: 1,
          name: 'Siamese',
          description:
            'Siamese cats are known for their slender bodies and blue eyes.',
        },
      ]);

    expect(await controller.findUpdateBreedOptions(1)).toEqual(results);

    expect(usecaseSpy).toHaveBeenCalledWith(1);
    expect(usecaseSpy).toHaveBeenCalledTimes(1);
  });

  it('findUpdateBreedOptions: not found resource', async () => {
    jest
      .spyOn(findBreedOptionsForUpdateUsecase, 'execute')
      .mockRejectedValue(new NotFoundException('Cat not found'));

    await expect(controller.findUpdateBreedOptions(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
