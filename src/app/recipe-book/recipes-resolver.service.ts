import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { take } from "rxjs/operators";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from '@ngrx/store';

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
  inject(Store<fromApp.AppState>).dispatch(new RecipesActions.FetchRecipes());

  return actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
};
