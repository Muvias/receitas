import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;

  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {};

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.shoppingListService.getIngredient(index);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    const newIngredient = new Ingredient(value.name, value.amount);

    if(this.editMode == false) {
      this.shoppingListService.addIngredient(newIngredient);
    } else {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    }

    form.reset();
    this.editMode = false;
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);

    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
