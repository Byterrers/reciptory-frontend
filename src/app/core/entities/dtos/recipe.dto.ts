import { Nutrient } from '../nutrient.class';
import { Preference } from '../preference.class';
import { Allergy } from '../allergy.class';

export class RecipeDto {
  id?: string;
  name: string;
  cookingTime: string;
  calories: number;
  ingredients: any[];
  steps: string[];
  nutrients: Nutrient[];
  preferences: Preference[];
  allergies: Allergy[];
  tags: string[];
  author: string;
  authorId: string;
  shared: boolean;
  rating?: number;
  rates?: [];
  comments?: [];
  originalId: string;
  isCopy: boolean;
  image: string;

  constructor() {}
}
