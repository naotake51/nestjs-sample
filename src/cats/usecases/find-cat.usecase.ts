import { Injectable } from '@nestjs/common';
import { Cat } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindCatUsecase {
  constructor(private prisma: PrismaService) {}

  async execute(id: number): Promise<Cat | null> {
    return await this.prisma.cat.findUnique({
      where: { id },
      include: { breed: true },
    });
  }
}
