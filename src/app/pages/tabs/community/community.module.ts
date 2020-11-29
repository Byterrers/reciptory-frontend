import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPage } from './community.page';
import { routing } from './community.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    routing
  ],
  declarations: [CommunityPage]
})
export class CommunityPageModule {}
