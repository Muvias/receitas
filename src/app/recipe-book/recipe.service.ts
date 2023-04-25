import { EventEmitter, Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Teste receita',
      'Uma descrição bem daora',
      'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      [
        new Ingredient('Carne', 1),
        new Ingredient('Batata Frita', 20),
      ]
    ),
    new Recipe(
      'Teste receita2',
      'Uma descrição bem daora2',
      'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      [
        new Ingredient('Pão de queijo', 5),
        new Ingredient('Manteiga', 1),
      ]
    )
  ];

  constructor(private shoppingListService: ShoppingListService) {};

  getRecipesArray() {
    return this.recipes.slice();
  };

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
