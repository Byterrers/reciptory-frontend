import { RouterModule, Routes } from '@angular/router';
import { CommunityPage } from './community.page';

export const routes: Routes = [
  {
    path: '',
    component: CommunityPage
  }
];

export const routing = RouterModule.forChild(routes);
