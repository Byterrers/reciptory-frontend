import { Recipe } from '../recipe.class';

export class RecipesBookDto {
  id?: string;
  name: string;
  recipes: string[];
  favorite: boolean;

  constructor() {}
}

export class AdvancedRecipesBookDto {
    id?: string;
    name: string;
    recipes: Recipe[];
    favorite: boolean;

    constructor() {}
}
