import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Cat } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { BreedSelectionRule } from '../breed-selection.rule';

@Injectable()
export class UpdateCatUsecase {
  constructor(
    private prisma: PrismaService,
    private breedSelectionRule: BreedSelectionRule,
  ) {}

  async execute(cat: Omit<Cat, 'breed'>): Promise<Cat | null> {
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
}
