import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcComponentsModule } from 'src/app/components/rc-components/rc-components.module';
import { SearchPopoverComponentModule } from './search-popover/search-popover.module';

import { SearchPage } from './search.page';
import { routing } from './search.routing';
import { SearchPopoverComponent } from './search-popover/search-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    routing,
    RcComponentsModule,
    SearchPopoverComponentModule
  ],
  entryComponents: [SearchPopoverComponent],
  declarations: [SearchPage]
})
export class SearchPageModule {}
