import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// Entities.
import { RecipesBook } from '../entities/recipesBook.class';

@Injectable({
  providedIn: 'root'
})
export class RecipesBookService {
  constructor(private httpService: HttpService) {}

  getRecipesBooks(): Observable<any> {
    return this.httpService.get('/recipes-book');
  }

  getRecipesBookById(recipesBookId: string): Observable<any> {
    return this.httpService.get(`/recipes-book/${recipesBookId}`);
  }

  getUserRecipesBooksByUserId(userId: string): Observable<any> {
    return this.httpService.get(`/recipes-book/${userId}/recipes-books`);
  }

  getUserFavoriteRecipesBookByUserId(userId: string): Observable<any> {
    return this.httpService.get(`/recipes-book/${userId}/favoriteRecipesBook`);
  }

  getUserNonFavoriteRecipesBooksByUserId(userId: string): Observable<any> {
    return this.httpService.get(`/recipes-book/${userId}/nonFavoriteRecipesBooks`);
  }

  insertUsersRecipesBook(recipesBook: RecipesBook): Observable<any> {
    return this.httpService.post(
      '/recipes-book/user-recipes-book',
      recipesBook
    );
  }

  updateUsersRecipesBook(
    recipesBookId: string,
    recipesBook: RecipesBook
  ): Observable<any> {
    return this.httpService.put(
      `/recipes-book/user-recipes-book/${recipesBookId}`,
      recipesBook
    );
  }

  takeRecipeOutFromRecipesBook(
    recipesBookId: string,
    recipeId: string
  ): Observable<any> {
    return this.httpService.put(
      `/recipes-book/user-recipes-book/${recipesBookId}/take-out-recipe/${recipeId}`,
      null
    );
  }

  deleteUsersRecipesBook(userId: string): Observable<any> {
    return this.httpService.delete(`/recipes-book/${userId}`);
  }
}
