import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { of } from "rxjs";
import { take, map, switchMap } from "rxjs/operators";
import { Store } from '@ngrx/store';
import { Actions, ofType } from "@ngrx/effects";

import { Recipe } from './recipe.model';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipe-book/store/recipe.actions';

interface Server {
  id: number;
  name: string;
  status: string;
}

export const RecipesResolverService: ResolveFn<Recipe[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const actions$ = inject(Actions);
  const store = inject(Store<fromApp.AppState>);

  return store.select('recipes').pipe(
    take(1),
    map(recipesState => {
      return recipesState.recipes;
    }),
    switchMap(recipes => {
      if (recipes.length === 0) {
        store.dispatch(new RecipesActions.FetchRecipes());

        return actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
      } else {
        return of(recipes);
      };
    })
  );

};
