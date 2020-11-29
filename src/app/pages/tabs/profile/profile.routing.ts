import { RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './profile.page';

export const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

export const routing = RouterModule.forChild(routes);
