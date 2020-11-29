import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcComponentsModule } from 'src/app/components/rc-components/rc-components.module';

import { InventoryComponent } from './inventory.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RcComponentsModule
  ],
  declarations: [InventoryComponent],
  exports: [InventoryComponent]
})
export class InventoryComponentModule {}
