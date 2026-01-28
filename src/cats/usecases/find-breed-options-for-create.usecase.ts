import { Injectable } from '@nestjs/common';
import { CatBreed } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

@Injectable()
export class FindBreedOptionsForCreateUsecase {
  constructor(
    private prisma: PrismaService,
    private breedSelectionRule: BreedSelectionRule,
  ) {}

  async execute(): Promise<CatBreed[]> {
    const breeds = await this.prisma.catBreed.findMany({
      orderBy: { name: 'asc' },
    });

    return breeds.filter((breed) =>
      this.breedSelectionRule.canSelectForCreate(breed),
    );
  }
}
