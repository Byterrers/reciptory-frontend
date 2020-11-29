import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsComponentsModule } from './tabs-components/tabs-components.module';

import { TabsPage } from './tabs.page';
import { TABS_ROUTES } from './tabs.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsComponentsModule,
    TABS_ROUTES
  ],
  declarations: [TabsPage],
  exports: [TabsPage]
})
export class TabsPageModule {}
