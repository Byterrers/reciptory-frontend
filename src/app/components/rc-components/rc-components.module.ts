import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcCardModule } from './rc-card/rc-card.module';
import { RcCardItemModule } from './rc-card-item/rc-card-item.module';
import { RcRecipeComponentModule } from './rc-recipe/rc-recipe.module';
import { RcMatrixComponentModule } from './rc-matrix/rc-matrix.module';
import { RcProfileOverviewComponentModule } from './rc-profile-overview/rc-profile-overview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcCardModule,
    RcCardItemModule,
    RcRecipeComponentModule,
    RcMatrixComponentModule,
    RcProfileOverviewComponentModule
  ],
  exports: [
    RcCardModule,
    RcCardItemModule,
    RcRecipeComponentModule,
    RcMatrixComponentModule,
    RcProfileOverviewComponentModule
  ]
})
export class RcComponentsModule {}
