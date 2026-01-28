import { Injectable, NotFoundException } from '@nestjs/common';
import { CatBreed } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

@Injectable()
export class FindBreedOptionsForUpdateUsecase {
  constructor(
    private prisma: PrismaService,
    private breedSelectionRule: BreedSelectionRule,
  ) {}

  async execute(catId: number): Promise<CatBreed[]> {
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
