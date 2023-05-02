import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
  IngredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[]= [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 3)
  ];

  getIngredient(index: number) {
    return this.ingredients[index];
  };

  getIngredients() {
    return this.ingredients.slice();
  };

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.IngredientsChanged.next(this.ingredients.slice());
  };

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.IngredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.IngredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.IngredientsChanged.next(this.ingredients.slice());

  }
}
