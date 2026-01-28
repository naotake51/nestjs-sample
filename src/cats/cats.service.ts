import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CatsService {
  constructor(private prisma: PrismaService) {}

  async create(cat: Omit<Cat, 'id' | 'breed'>): Promise<Cat> {
    return await this.prisma.cat.create({
      data: cat,
      include: { breed: true },
    });
  }

  async update(cat: Omit<Cat, 'breed'>): Promise<Cat | null> {
    try {
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
}
