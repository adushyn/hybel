import { Routes } from '@angular/router';
import { CustomerInfoComponent } from './features/customer/customer-info.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/portfolio',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: CustomerInfoComponent
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./features/portfolio/portfolio.routes').then(m => m.portfolioRoutes)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
