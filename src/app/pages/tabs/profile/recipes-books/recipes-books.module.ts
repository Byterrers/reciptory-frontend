import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcRecipesBookComponentModule } from '../../../../components/rc-components/rc-recipes-book/rc-recipes-book.module';
import { RcRecipesBookComponent } from '../../../../components/rc-components/rc-recipes-book/rc-recipes-book.component';

import { RecipesBookFormComponentModule } from '../../tabs-components/recipes-book-form/recipes-book-form.module';
import { RecipesBookFormComponent } from '../../tabs-components/recipes-book-form/recipes-book-form.component';

import { RecipesBooksComponent } from './recipes-books.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcRecipesBookComponentModule,
    RecipesBookFormComponentModule
  ],
  entryComponents: [RecipesBookFormComponent, RcRecipesBookComponent],
  declarations: [RecipesBooksComponent],
  exports: [RecipesBooksComponent]
})
export class RecipesBooksComponentModule {}
