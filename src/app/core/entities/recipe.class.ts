import { Preference } from './preference.class';
import { Allergy } from './allergy.class';
import { Nutrient } from './nutrient.class';

export class Recipe {
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
  rates?: any[];
  comments?: any[];
  originalId: string;
  isCopy: boolean;
  image: string;

  constructor() {}
}

