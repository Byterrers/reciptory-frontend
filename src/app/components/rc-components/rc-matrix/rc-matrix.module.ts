import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcRecipeComponentModule } from '../rc-recipe/rc-recipe.module';
import { RecipeFormComponentModule } from 'src/app/pages/tabs/tabs-components/recipe-form/recipe-form.module';

import { RcRecipeComponent } from '../rc-recipe/rc-recipe.component';
import { RecipeFormComponent } from 'src/app/pages/tabs/tabs-components/recipe-form/recipe-form.component';

import { RcMatrixComponent } from './rc-matrix.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcRecipeComponentModule,
    RecipeFormComponentModule
  ],
  entryComponents: [RcRecipeComponent, RecipeFormComponent],
  declarations: [RcMatrixComponent],
  exports: [RcMatrixComponent]
})
export class RcMatrixComponentModule {}

