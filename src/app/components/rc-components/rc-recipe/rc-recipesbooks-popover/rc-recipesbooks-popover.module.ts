import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcRecipesBooksPopoverComponent } from './rc-recipesbooks-popover.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [RcRecipesBooksPopoverComponent],
  exports: [RcRecipesBooksPopoverComponent]
})
export class RcRecipesBooksPopoverComponentModule {}
