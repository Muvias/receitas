import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Store } from '@ngrx/store';

import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>,
  ) { };

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  };

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  };
}
