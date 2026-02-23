import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioMetrics } from '../../utils/metrics.utils';
import { PaymentSummary } from '../../models/rent-payment.model';

/**
 * Pure presentational component for displaying portfolio summary metrics and payment summary
 *
 * Requirements:
 * - No business logic
 * - OnPush change detection for performance
 * - Uses Angular Material mat-card
 * - Formats currency using nb-NO locale
 * - Displays both portfolio metrics and payment summary in one card
 */
@Component({
    selector: 'app-portfolio-summary',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './portfolio-summary.component.html',
    styleUrl: './portfolio-summary.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSummaryComponent {
  /**
   * Portfolio metrics to display
   * Contains: totalProperties, occupancyRate, monthlyIncome
   */
  @Input({ required: true }) metrics!: PortfolioMetrics;

  /**
   * Payment summary to display
   * Contains: totalPaid, totalPending, totalOverdue, counts
   */
  @Input({ required: true }) paymentSummary!: PaymentSummary;
}
