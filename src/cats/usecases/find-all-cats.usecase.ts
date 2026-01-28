import { Injectable } from '@nestjs/common';
import { Cat } from '../interfaces/cat.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindAllCatsUsecase {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<Cat[]> {
    return await this.prisma.cat.findMany({
      include: { breed: true },
    });
  }
}
