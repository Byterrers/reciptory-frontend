import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './search.page';

export const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

export const routing = RouterModule.forChild(routes);
