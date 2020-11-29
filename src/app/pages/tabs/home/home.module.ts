import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListComponentModule } from './shopping-list/shopping-list.module';
import { InventoryComponentModule } from './inventory/inventory.module';

import { routing } from './home.routing';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryComponentModule,
    ShoppingListComponentModule,
    routing,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
