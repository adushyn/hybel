import { Component, ChangeDetectionStrategy, OnInit, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PortfolioStore } from './portfolio.store';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioViewModel } from './models/portfolio-view.model';

import { PortfolioSummaryComponent } from './components/summary/portfolio-summary.component';

/**
 * Portfolio Dashboard Component
 * Displays high-level summary cards and metrics
 */
@Component({
  selector: 'app-portfolio-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    PortfolioSummaryComponent
  ],
  templateUrl: './portfolio-dashboard.component.html',
  styleUrl: './portfolio-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioDashboardComponent implements OnInit {
  private readonly store = inject(PortfolioStore);
  private readonly service = inject(PortfolioService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // ViewModel from store
  protected readonly vm: Signal<PortfolioViewModel> = this.store.vm;

  ngOnInit(): void {
    this.loadPortfolioData();
  }

  navigateToProperties(): void {
    this.router.navigate(['/portfolio/properties']);
  }

  navigateToPropertiesWithFilter(filterType: 'needsAttention' | 'overduePayment' | 'expiringSoon'): void {
    const queryParams: any = {};

    switch (filterType) {
      case 'needsAttention':
        queryParams.needsAttention = 'true';
        break;
      case 'overduePayment':
        queryParams.hasOverduePayment = 'true';
        break;
      case 'expiringSoon':
        queryParams.leaseExpiringSoon = 'true';
        break;
    }

    this.router.navigate(['/portfolio/properties'], { queryParams });
  }

  private loadPortfolioData(): void {
    this.store.setLoading(true);

    this.service.loadPortfolioData().subscribe({
      next: (data) => {
        this.store.setProperties(data.properties);
        this.store.setPayments(data.payments);

        const statistics = this.store.calculateStatistics(data.properties, data.payments);
        const paymentSummary = this.store.calculatePaymentSummary(data.payments);

        this.store.setStatistics(statistics);
        this.store.setPaymentSummary(paymentSummary);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError('Failed to load portfolio data');
        this.store.setLoading(false);
        this.snackBar.open('Failed to load portfolio', 'Close', { duration: 3000 });
      }
    });
  }
}
