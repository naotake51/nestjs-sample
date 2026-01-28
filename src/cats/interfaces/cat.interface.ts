export interface Cat {
  id: number;
  name: string;
  age: number;
  breedId: number;
  breed?: CatBreed;
}

export interface CatBreed {
  id: number;
  name: string;
  description: string;
}
