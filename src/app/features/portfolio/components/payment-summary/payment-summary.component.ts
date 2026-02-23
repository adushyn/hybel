import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PaymentSummary } from '../../models/rent-payment.model';

/**
 * Pure presentational component for payment summary
 *
 * Requirements:
 * - Displays payment statistics (Paid/Pending/Overdue)
 * - OnPush change detection for performance
 * - Uses Angular Material components
 */
@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSummaryComponent {
  /**
   * Payment summary data
   */
  @Input({ required: true }) summary!: PaymentSummary;
}
