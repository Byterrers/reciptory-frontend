import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ProfileFormComponentModule } from './profile-form/profile-form.module';

import { RcScannerOcrComponentModule } from './rc-scanner-ocr/rc-scanner-ocr.module';
import { RcScannerOcrComponent } from './rc-scanner-ocr/rc-scanner-ocr.component';

import { RecipesBookFormComponentModule } from './recipes-book-form/recipes-book-form.module';
import { RecipesBookFormComponent } from './recipes-book-form/recipes-book-form.component';

import { RecipeFormComponentModule } from './recipe-form/recipe-form.module';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

import { ProductFormComponentModule } from './product-form/product-form.module';
import { ProductFormComponent } from './product-form/product-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileFormComponentModule,
    RcScannerOcrComponentModule,
    RecipesBookFormComponentModule,
    RecipeFormComponentModule,
    ProductFormComponentModule
  ],
  entryComponents: [
    ProfileFormComponent,
    RcScannerOcrComponent,
    RecipesBookFormComponent,
    RecipeFormComponent,
    ProductFormComponent
  ],
  exports: [
    ProfileFormComponentModule,
    RcScannerOcrComponentModule,
    RecipesBookFormComponentModule,
    RecipeFormComponentModule,
    ProductFormComponentModule
  ]
})
export class TabsComponentsModule {}
