import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Cat } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeleteCatUsecase {
  constructor(private prisma: PrismaService) {}

  async execute(id: number): Promise<Cat | null> {
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
}
