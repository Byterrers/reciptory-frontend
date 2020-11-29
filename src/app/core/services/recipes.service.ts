import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// Entities.
import { RecipeDto } from '../entities/dtos/recipe.dto';
import { IngredientDto } from '../entities/dtos/ingredient.dto';
import { CategoryDto } from '../entities/dtos/category.dto';
import { PreferenceDto } from '../entities/dtos/preference.dto';
import { AllergyDto } from '../entities/dtos/allergy.dto';
import { NutrientDto } from '../entities/dtos/nutrient.dto';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  constructor(private httpService: HttpService) {}

  getRecipes(): Observable<any> {
    return this.httpService.get('/recipes');
  }

  getSharedRecipes(): Observable<any> {
    return this.httpService.get('/recipes/shared');
  }

  getRecipeById(recipeId: string): Observable<any> {
    return this.httpService.get(`/recipes/${recipeId}`);
  }

  searchRecipeByName(
    name: string,
    byInventory: boolean,
    byPreferences: boolean,
    byAllergies: boolean,
    userId: string
  ): Observable<any> {
    return this.httpService.get(
      // tslint:disable-next-line: max-line-length
      `/recipes/search/recipes?name=${name}&byInventory=${byInventory}&byPreferences=${byPreferences}&byAllergies=${byAllergies}&userId=${userId}`
    );
  }

  searchRecipeByIngredient(ingredient: string): Observable<any> {
    return this.httpService.get(
      `/recipes/search-by-ingredient/recipes?ingredient=${ingredient}`
    );
  }

  createRecipe(recipe: RecipeDto): Observable<any> {
    return this.httpService.post('/recipes', recipe);
  }

  createUserRecipe(userId: string, recipe: RecipeDto): Observable<any> {
    return this.httpService.post(`/recipes/user-recipes/${userId}`, recipe);
  }

  updateRecipe(recipe: RecipeDto): Observable<any> {
    return this.httpService.put(`/recipes/${recipe.id}`, recipe);
  }

  deleteRecipe(recipeId: string): Observable<any> {
    return this.httpService.delete(`/recipes/${recipeId}`);
  }

  deleteUserRecipe(recipeId: string, userId: string): Observable<any> {
    return this.httpService.delete(
      `/recipes/${recipeId}/user-recipes/${userId}`
    );
  }

  /* Recipe functions */

  cookRecipe(recipeId: string, userId: string): Observable<any> {
    return this.httpService.put(
      `/recipes/${recipeId}/cook-recipe/${userId}`,
      null
    );
  }

  addRecipeIngredientsToShoppingList(
    recipeId: string,
    userId: string
  ): Observable<any> {
    return this.httpService.put(
      `/recipes/${recipeId}/add-recipe-ingredients/${userId}`,
      null
    );
  }

  /* Community */

  shareRecipe(recipeId: string, shared: any) {
    return this.httpService.put(`/recipes/${recipeId}/share-recipe`, shared);
  }

  commentRecipe(recipeId: string, comment: any) {
    return this.httpService.put(`/recipes/${recipeId}/comment-recipe`, comment);
  }

  rateRecipe(recipeId: string, rating: any) {
    return this.httpService.put(`/recipes/${recipeId}/rate-recipe`, rating);
  }

  saveRecipe(recipeId: string, recipesBookId: string, recipeUserInfo: any) {
    return this.httpService.post(
      `/recipes/${recipeId}/save-recipe/${recipesBookId}`,
      recipeUserInfo
    );
  }

  /* Ingredients. */

  getIngredients(): Observable<any> {
    return this.httpService.get('/ingredients');
  }

  createIngredient(ingredient: IngredientDto): Observable<any> {
    return this.httpService.post('/ingredients', ingredient);
  }

  searchIngredients(name: string): Observable<any> {
    return this.httpService.get(`/ingredients/search/ingredients?name=${name}`);
  }

  /* Categories. */

  getCategories(): Observable<any> {
    return this.httpService.get('/categories');
  }

  createCategory(category: CategoryDto): Observable<any> {
    return this.httpService.post('/categories', category);
  }

  /* Preferences. */

  getPreferences(): Observable<any> {
    return this.httpService.get('/preferences');
  }

  createPreference(preference: PreferenceDto): Observable<any> {
    return this.httpService.post('/preferences', preference);
  }

  /* Allergies. */

  getAllergies(): Observable<any> {
    return this.httpService.get('/allergies');
  }

  createAllergy(allergy: AllergyDto): Observable<any> {
    return this.httpService.post('/allergies', allergy);
  }

  /* Nutrients. */

  getNutrients(): Observable<any> {
    return this.httpService.get('/nutrients');
  }

  createNutrient(nutrient: NutrientDto): Observable<any> {
    return this.httpService.post('/nutrients', nutrient);
  }
}
