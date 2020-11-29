import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcCardItemModule } from '../rc-card-item/rc-card-item.module';

import { RcCardComponent } from './rc-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcCardItemModule
  ],
  declarations: [RcCardComponent],
  exports: [RcCardComponent]
})
export class RcCardModule {}
