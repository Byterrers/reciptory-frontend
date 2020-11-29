import { Recipe } from './recipe.class';

export class RecipesBook {
  id?: string;
  name: string;
  recipes: string[];
  favorite: boolean;

  constructor() {}
}

export class AdvancedRecipesBook {
  id?: string;
  name: string;
  recipes: Recipe[];
  favorite: boolean;

  constructor() {}
}
