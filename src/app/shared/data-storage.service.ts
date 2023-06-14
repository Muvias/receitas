import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Store } from "@ngrx/store";
import { map, tap } from "rxjs/operators";

import { RecipeService } from "../recipe-book/recipe.service";
import { Recipe } from "../recipe-book/recipe.model";

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipe-book/store/recipe.actions';

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private store: Store<fromApp.AppState>,
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
        this.store.dispatch(new RecipesActions.SetRecipes(recipes));
      }));
  }
};
