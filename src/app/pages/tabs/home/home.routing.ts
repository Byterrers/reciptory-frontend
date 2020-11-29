import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

export const routing = RouterModule.forChild(routes);
