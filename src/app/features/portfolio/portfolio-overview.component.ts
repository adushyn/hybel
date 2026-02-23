import { Component, ChangeDetectionStrategy, OnInit, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PortfolioStore } from './portfolio.store';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioViewModel } from './models/portfolio-view.model';
import { PropertyWithStatus } from './models/property.model';
import { PropertyFilters as ComponentFilters } from './components/filters/portfolio-filters.component';

import { PortfolioFiltersComponent } from './components/filters/portfolio-filters.component';
import { PropertyTableComponent } from './components/table/property-table.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-portfolio-overview',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        PortfolioFiltersComponent,
        PropertyTableComponent
    ],
    templateUrl: './portfolio-overview.component.html',
    styleUrl: './portfolio-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioOverviewComponent implements OnInit {
  private readonly store = inject(PortfolioStore);
  private readonly service = inject(PortfolioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  // ViewModel from store - using Angular Signals
  protected readonly vm: Signal<PortfolioViewModel> = this.store.vm;

  ngOnInit(): void {
    this.loadPortfolioData();
    this.applyFiltersFromQueryParams();
  }

  /**
   * Apply filters from URL query parameters
   */
  private applyFiltersFromQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      // Check if any Quick Stats filters are present
      const hasQuickStatFilter =
        params['needsAttention'] === 'true' ||
        params['hasOverduePayment'] === 'true' ||
        params['leaseExpiringSoon'] === 'true';

      // Reset filters first if coming from Quick Stats
      if (hasQuickStatFilter) {
        this.store.resetFilters();
      }

      const filterUpdates: any = {};

      if (params['needsAttention'] === 'true') {
        filterUpdates.needsAttention = true;
      }
      if (params['hasOverduePayment'] === 'true') {
        filterUpdates.hasOverduePayment = true;
      }
      if (params['leaseExpiringSoon'] === 'true') {
        filterUpdates.leaseExpiringSoon = true;
      }

      // Apply filters if any were found in query params
      if (Object.keys(filterUpdates).length > 0) {
        this.store.updateFilters(filterUpdates);
      }
    });
  }

  // Event handlers
  handleFiltersChange(componentFilters: ComponentFilters): void {
    // Convert component filters to store filters format
    this.store.updateFilters({
      searchTerm: componentFilters.searchTerm,
      status: componentFilters.status,
      type: componentFilters.type,
      city: componentFilters.city,
      hasOverduePayment: componentFilters.hasOverduePayment,
      leaseExpiringSoon: componentFilters.leaseExpiringSoon,
      needsAttention: componentFilters.needsAttention
    });
  }

  handleResetFilters(): void {
    this.store.resetFilters();
    this.snackBar.open('Filters reset', 'Close', { duration: 2000 });
  }

  handleViewDetails(property: PropertyWithStatus): void {
    this.router.navigate(['/portfolio', property.id]);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/portfolio']);
  }

  // Private methods
  private loadPortfolioData(): void {
    this.store.setLoading(true);

    this.service.loadPortfolioData().subscribe({
      next: (data) => {
        // Set raw data
        this.store.setProperties(data.properties);
        this.store.setPayments(data.payments);

        // Calculate and set statistics using store's business logic
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
