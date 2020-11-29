import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcComponentsModule } from 'src/app/components/rc-components/rc-components.module';

import { RcRecipesBookComponent } from './rc-recipes-book.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcComponentsModule
  ],
  declarations: [RcRecipesBookComponent],
  exports: [RcRecipesBookComponent]
})
export class RcRecipesBookComponentModule {}
