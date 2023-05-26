import { NgModule } from "@angular/core";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    DropdownDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoadingSpinnerComponent,
    DropdownDirective,
    CommonModule,
  ],
})
export class SharedModule {};
