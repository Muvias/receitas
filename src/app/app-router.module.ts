import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('./recipe-book/recipes.module').then(module => module.RecipesModule) },
  { path: 'shoppingList', loadChildren: () => import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule) },
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRouterModule {

}
