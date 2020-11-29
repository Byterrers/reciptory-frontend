import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPopoverComponent } from './search-popover.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [SearchPopoverComponent],
  exports: [SearchPopoverComponent]
})
export class SearchPopoverComponentModule {}
