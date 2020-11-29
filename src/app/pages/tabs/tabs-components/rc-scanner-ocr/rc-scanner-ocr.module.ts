import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductFormComponentModule } from '../product-form/product-form.module';
import { ProductFormComponent } from '../product-form/product-form.component';

import { RcScannerOcrComponent } from './rc-scanner-ocr.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductFormComponentModule
  ],
  entryComponents: [ProductFormComponent],
  declarations: [RcScannerOcrComponent]
})
export class RcScannerOcrComponentModule {}
