import { Injectable } from '@nestjs/common';
import { Cat, CatBreed } from './interfaces/cat.interface';

@Injectable()
export class BreedSelectionRule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canSelectForCreate(breed: CatBreed): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canSelectForUpdate(breed: CatBreed, cat: Cat): boolean {
    return true;
  }
}
