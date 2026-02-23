import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { PropertyWithStatus } from '../../models/property.model';

/**
 * View mode type
 */
export type ViewMode = 'table' | 'card';

/**
 * Pure presentational component for displaying properties in a table
 *
 * Requirements:
 * - No filtering logic inside component
 * - OnPush change detection for performance
 * - trackBy function for optimal rendering
 * - Uses Angular Material mat-table
 */
@Component({
  selector: 'app-property-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatCardModule,
    MatTooltipModule,
    MatSortModule
  ],
  templateUrl: './property-table.component.html',
  styleUrl: './property-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyTableComponent implements AfterViewInit {
  /**
   * Properties to display in the table
   * Pre-filtered by parent component
   */
  @Input({ required: true })
  set properties(value: readonly PropertyWithStatus[]) {
    this.dataSource.data = [...value];
  }

  /**
   * MatSort instance for sorting
   */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Data source for the table with sorting support
   */
  protected readonly dataSource = new MatTableDataSource<PropertyWithStatus>();

  /**
   * Emits when a row is clicked
   */
  @Output() rowClick = new EventEmitter<PropertyWithStatus>();

  /**
   * Current view mode (table or card)
   */
  protected readonly viewMode = signal<ViewMode>('table');

  /**
   * Columns to display in the table
   */
  readonly displayedColumns: string[] = [
    'address',
    'status',
    'tenant',
    'rent',
    'leaseExpiry',
    'paymentStatus'
  ];

  /**
   * Switch between table and card view modes
   */
  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  /**
   * TrackBy function for optimal rendering performance
   * Angular will reuse DOM elements for items with the same ID
   */
  trackByPropertyId(index: number, property: PropertyWithStatus): string {
    return property.id;
  }

  /**
   * Handle row click event
   */
  onRowClick(property: PropertyWithStatus): void {
    this.rowClick.emit(property);
  }

  /**
   * Handle card click event
   */
  onCardClick(property: PropertyWithStatus): void {
    this.rowClick.emit(property);
  }

  /**
   * Initialize sorting after view is ready
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    // Custom sorting for nested and computed properties
    this.dataSource.sortingDataAccessor = (property: PropertyWithStatus, sortHeaderId: string): string | number => {
      switch (sortHeaderId) {
        case 'address':
          return property.address.toLowerCase();
        case 'status':
          return property.status;
        case 'tenant':
          return property.tenant?.name?.toLowerCase() ?? '';
        case 'rent':
          return property.monthlyRent;
        case 'leaseExpiry':
          return property.leaseExpires?.getTime() ?? 0;
        case 'paymentStatus':
          // Sort by: overdue (2), current (1), no payment (0)
          if (property.hasOverduePayment) return 2;
          if (property.tenant) return 1;
          return 0;
        default:
          return '';
      }
    };
  }
}
