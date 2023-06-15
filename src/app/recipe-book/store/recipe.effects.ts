import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { switchMap, map } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { Recipe } from "../recipe.model";

import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>('https://ng-receps-default-rtdb.firebaseio.com/recipes.json');
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  ))

  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) { };
};
