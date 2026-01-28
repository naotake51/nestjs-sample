import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cat, CatBreed } from './interfaces/cat.interface';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { BreedSelectionRule } from './breed-selection.rule';

@Injectable()
export class CatsService {
  constructor(
    private prisma: PrismaService,
    private breedSelectionRule: BreedSelectionRule,
  ) {}

  async create(cat: Omit<Cat, 'id' | 'breed'>): Promise<Cat> {
    const breed = await this.prisma.catBreed.findUnique({
      where: { id: cat.breedId },
    });

    if (!breed || !this.breedSelectionRule.canSelectForCreate(breed)) {
      throw new BadRequestException('Invalid breed selection');
    }

    return await this.prisma.cat.create({
      data: cat,
      include: { breed: true },
    });
  }

  async update(cat: Omit<Cat, 'breed'>): Promise<Cat | null> {
    try {
      const breed = await this.prisma.catBreed.findUnique({
        where: { id: cat.breedId },
      });

      if (!breed || !this.breedSelectionRule.canSelectForUpdate(breed, cat)) {
        throw new BadRequestException('Invalid breed selection');
      }

      return await this.prisma.cat.update({
        where: { id: cat.id },
        data: cat,
        include: { breed: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: number): Promise<Cat | null> {
    try {
      return await this.prisma.cat.delete({
        where: { id },
        include: { breed: true },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }

  async findAll(): Promise<Cat[]> {
    return await this.prisma.cat.findMany({
      include: { breed: true },
    });
  }

  async findOne(id: number): Promise<Cat | null> {
    return await this.prisma.cat.findUnique({
      where: { id },
      include: { breed: true },
    });
  }

  async findBreedOptionsForCreate(): Promise<CatBreed[]> {
    const breeds = await this.prisma.catBreed.findMany({
      orderBy: { name: 'asc' },
    });

    return breeds.filter((breed) =>
      this.breedSelectionRule.canSelectForCreate(breed),
    );
  }

  async findBreedOptionsForUpdate(catId: number): Promise<CatBreed[]> {
    const cat = await this.prisma.cat.findUnique({
      where: { id: catId },
    });

    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    const breeds = await this.prisma.catBreed.findMany({
      orderBy: { name: 'asc' },
    });

    return breeds.filter((breed) =>
      this.breedSelectionRule.canSelectForUpdate(breed, cat),
    );
  }
}
