import { Ingredient } from './ingredient.class';

export class Product {
  id?: string;
  ingredient: Ingredient;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;

  constructor() {}
}
