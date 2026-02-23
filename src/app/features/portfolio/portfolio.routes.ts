import { Routes } from '@angular/router';
import { PortfolioDashboardComponent } from './portfolio-dashboard.component';
import { PortfolioOverviewComponent } from './portfolio-overview.component';
import { PortfolioDetailComponent } from './portfolio-detail.component';

export const portfolioRoutes: Routes = [
  {
    path: '',
    component: PortfolioDashboardComponent
  },
  {
    path: 'properties',
    component: PortfolioOverviewComponent
  },
  {
    path: ':id',
    component: PortfolioDetailComponent
  }
];
