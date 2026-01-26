import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotFoundException } from '@nestjs/common';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
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

    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(results);

    expect(await controller.findAll()).toEqual(results);

    expect(findAllSpy).toHaveBeenCalledTimes(1);
  });

  it('findOne', async () => {
    const result = {
      id: 1,
      name: 'Kitty',
      age: 2,
      breed: 'Siamese',
    };

    const findOneSpy = jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne(1)).toEqual(result);

    expect(findOneSpy).toHaveBeenCalledWith(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('findOne: not found resource', async () => {
    const result = null;

    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    await expect(controller.findOne(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create', async () => {
    const createDto = {
      name: 'Mochi',
      age: 1,
      breed: 'Munchkin',
    };
    const result = {
      id: 1,
      ...createDto,
    };

    const createSpy = jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createDto)).toEqual(result);

    expect(createSpy).toHaveBeenCalledWith(createDto);
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it('update', async () => {
    const updateDto = {
      name: 'Luna',
      age: 3,
      breed: 'Ragdoll',
    };
    const result = {
      id: 1,
      ...updateDto,
    };

    const updateSpy = jest.spyOn(service, 'update').mockResolvedValue(result);

    expect(await controller.update(1, updateDto)).toEqual(result);

    expect(updateSpy).toHaveBeenCalledWith({
      id: 1,
      ...updateDto,
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it('update: not found resource', async () => {
    const updateDto = {
      name: 'Luna',
      age: 3,
      breed: 'Ragdoll',
    };
    const result = null;

    jest.spyOn(service, 'update').mockResolvedValue(result);

    await expect(controller.update(1, updateDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove', async () => {
    const result = {
      id: 1,
      name: 'Poppy',
      age: 4,
      breed: 'Siberian',
    };

    const deleteSpy = jest.spyOn(service, 'delete').mockResolvedValue(result);

    expect(await controller.remove(1)).toEqual(result);

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('remove: not found resource', async () => {
    const result = null;

    jest.spyOn(service, 'delete').mockResolvedValue(result);

    await expect(controller.remove(1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
