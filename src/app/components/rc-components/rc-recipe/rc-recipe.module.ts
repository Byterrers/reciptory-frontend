import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcRecipesBooksPopoverComponent } from './rc-recipesbooks-popover/rc-recipesbooks-popover.component';
import { RcRecipesBooksPopoverComponentModule } from './rc-recipesbooks-popover/rc-recipesbooks-popover.module';
import { RecipesBookFormComponent } from 'src/app/pages/tabs/tabs-components/recipes-book-form/recipes-book-form.component';
import { TabsComponentsModule } from 'src/app/pages/tabs/tabs-components/tabs-components.module';

import { RcRecipeComponent } from './rc-recipe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcRecipesBooksPopoverComponentModule,
    TabsComponentsModule
  ],
  entryComponents: [RcRecipesBooksPopoverComponent, RecipesBookFormComponent],
  declarations: [RcRecipeComponent],
  exports: [RcRecipeComponent]
})
export class RcRecipeComponentModule {}
