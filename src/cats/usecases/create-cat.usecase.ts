import { BadRequestException, Injectable } from '@nestjs/common';
import { Cat } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

@Injectable()
export class CreateCatUsecase {
  constructor(
    private prisma: PrismaService,
    private breedSelectionRule: BreedSelectionRule,
  ) {}

  async execute(cat: Omit<Cat, 'id' | 'breed'>): Promise<Cat> {
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
}
