import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { exhaustMap, map, take, tap } from "rxjs/operators";

import { RecipeService } from "../recipe-book/recipe.service";
import { Recipe } from "../recipe-book/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authservice: AuthService
  ) { };

  storeRecipes() {
    const recipes = this.recipesService.getRecipesArray();
    this.http.put('https://ng-receps-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => console.log(response));
  };

  fetchRecipes() {

    return this.http.get<Recipe[]>('https://ng-receps-default-rtdb.firebaseio.com/recipes.json').pipe(map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        }
      });
    }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes)
      }));
  }
};
