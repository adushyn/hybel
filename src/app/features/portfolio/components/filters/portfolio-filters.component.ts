import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { PropertyStatus, PropertyType } from '../../models/property.model';

/**
 * Filter object for property filtering
 */
export interface PropertyFilters {
  searchTerm: string;
  status: PropertyStatus | null;
  type: PropertyType | null;
  city: string | null;
  hasOverduePayment: boolean;
  leaseExpiringSoon: boolean;
  needsAttention: boolean;
}

/**
 * Pure presentational component for property filters
 *
 * Requirements:
 * - No data logic or filtering implementation
 * - OnPush change detection for performance
 * - Emits filter changes via Output
 * - Uses Angular Material components
 */
@Component({
    selector: 'app-portfolio-filters',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatSlideToggleModule,
        MatBadgeModule
    ],
    templateUrl: './portfolio-filters.component.html',
    styleUrl: './portfolio-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioFiltersComponent {
  /**
   * Current filter state
   */
  @Input({ required: true }) filters!: PropertyFilters;

  /**
   * List of available cities for the city dropdown
   */
  @Input({ required: true }) availableCities!: readonly string[];

  /**
   * Count of properties with overdue payments
   */
  @Input({ required: true }) overduePaymentCount!: number;

  /**
   * Count of properties with leases expiring soon
   */
  @Input({ required: true }) expiringSoonCount!: number;

  /**
   * Count of properties that need attention
   */
  @Input({ required: true }) needsAttentionCount!: number;

  /**
   * Emits when any filter changes
   */
  @Output() filtersChange = new EventEmitter<PropertyFilters>();

  /**
   * Handle search input change
   */
  onSearchChange(searchTerm: string): void {
    this.filtersChange.emit({
      ...this.filters,
      searchTerm
    });
  }

  /**
   * Handle status dropdown change
   */
  onStatusChange(status: PropertyStatus | null): void {
    this.filtersChange.emit({
      ...this.filters,
      status
    });
  }

  /**
   * Handle type dropdown change
   */
  onTypeChange(type: PropertyType | null): void {
    this.filtersChange.emit({
      ...this.filters,
      type
    });
  }

  /**
   * Handle city dropdown change
   */
  onCityChange(city: string | null): void {
    this.filtersChange.emit({
      ...this.filters,
      city
    });
  }

  /**
   * Handle overdue payments toggle change
   */
  onOverdueChange(checked: boolean): void {
    this.filtersChange.emit({
      ...this.filters,
      hasOverduePayment: checked
    });
  }

  /**
   * Handle expiring soon toggle change
   */
  onExpiringSoonChange(checked: boolean): void {
    this.filtersChange.emit({
      ...this.filters,
      leaseExpiringSoon: checked
    });
  }

  /**
   * Handle needs attention toggle change
   */
  onNeedsAttentionChange(checked: boolean): void {
    this.filtersChange.emit({
      ...this.filters,
      needsAttention: checked
    });
  }
}
