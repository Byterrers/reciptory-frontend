import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const tabsRoutes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule)
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchPageModule)
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./community/community.module').then((m) => m.CommunityPageModule)
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule)
      },
      {
        path: 'public-profile/:id',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule)
      }
    ]
  }
];

export const TABS_ROUTES = RouterModule.forChild(tabsRoutes);
