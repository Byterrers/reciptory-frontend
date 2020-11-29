import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IonicSelectableModule } from 'ionic-selectable';

import { RecipesBookFormComponent } from './recipes-book-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule
  ],
  declarations: [RecipesBookFormComponent],
  exports: [RecipesBookFormComponent]
})
export class RecipesBookFormComponentModule {}
