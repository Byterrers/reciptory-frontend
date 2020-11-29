import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcComponentsModule } from 'src/app/components/rc-components/rc-components.module';
import { RecipesBooksComponentModule } from './recipes-books/recipes-books.module';

import { ProfilePage } from './profile.page';
import { routing } from './profile.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RcComponentsModule,
    RecipesBooksComponentModule,
    routing
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
