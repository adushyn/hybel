import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PropertyWithStatus } from '../../models/property.model';

@Component({
  selector: 'app-portfolio-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './portfolio-table.component.html',
  styleUrl: './portfolio-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioTableComponent {
  @Input({ required: true}) properties!: readonly PropertyWithStatus[];
  @Output() viewDetails = new EventEmitter<string>();

  readonly displayedColumns = ['attention', 'address', 'type', 'status', 'tenant', 'rent', 'leaseExpires', 'actions'];

  onViewDetails(id: string): void {
    this.viewDetails.emit(id);
  }

  getAttentionTooltip(property: PropertyWithStatus): string {
    switch (property.attentionReason) {
      case 'overdue_rent':
        return 'Rent payment is overdue';
      case 'lease_expiring_soon':
        return `Lease expiring in ${property.daysUntilLeaseExpiry} days`;
      case 'lease_expired':
        return 'Lease has expired';
      default:
        return 'Needs attention';
    }
  }
}
