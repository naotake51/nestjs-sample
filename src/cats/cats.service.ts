import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    {
      id: '73e294af-13b5-44d1-b1c5-c91c722edfc0',
      name: 'Tom',
      age: 3,
      breed: 'Tabby',
    },
    {
      id: 'ba1fb577-a202-453a-9cb0-6126a7ea227e',
      name: 'Jerry',
      age: 2,
      breed: 'Siamese',
    },
  ];

  async create(cat: Omit<Cat, 'id'>): Promise<Cat> {
    const id = crypto.randomUUID();
    const newCat: Cat = { id, ...cat };

    this.cats.push(newCat);

    return newCat;
  }

  async update(cat: Cat): Promise<void> {
    const index = this.cats.findIndex((c) => c.id === cat.id);
    if (index !== -1) {
      this.cats[index] = cat;
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.cats.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.cats.splice(index, 1);
    }
  }

  async findAll(): Promise<Cat[]> {
    return this.cats;
  }

  async findOne(id: string): Promise<Cat | null> {
    return this.cats.find((cat) => cat.id === id) || null;
  }
}
