import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RecipeListComponent } from "./recipe-book/recipe-list/recipe-list.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./recipe-book/recipe-start/recipe-start.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent, children: [
    { path: '', component: RecipeStartComponent }
  ] },
  { path: 'shoppingList', component: ShoppingListComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRouterModule {

}
