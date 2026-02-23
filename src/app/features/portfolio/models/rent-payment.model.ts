/**
 * Payment Status Union Type
 * Based on Hybel case requirements
 */
export type PaymentStatus =
  | 'paid'
  | 'pending'
  | 'overdue';

/**
 * Rent Payment Interface
 * Represents a monthly rent payment for a property
 */
export interface RentPayment {
  readonly id: string;
  readonly propertyId: string;
  readonly propertyAddress: string;
  readonly tenantId: string;
  readonly tenantName: string;
  readonly amount: number;
  readonly currency: 'NOK';
  readonly dueDate: Date;
  readonly paidDate: Date | null;
  readonly status: PaymentStatus;
  readonly month: string; // 'YYYY-MM'
}

/**
 * Payment Summary Statistics
 */
export interface PaymentSummary {
  readonly totalExpected: number;
  readonly totalPaid: number;
  readonly totalPending: number;
  readonly totalOverdue: number;
  readonly paidCount: number;
  readonly pendingCount: number;
  readonly overdueCount: number;
}

/**
 * Monthly Payment Overview
 */
export interface MonthlyPaymentOverview {
  readonly month: string;
  readonly totalExpected: number;
  readonly totalCollected: number;
  readonly collectionRate: number; // percentage
  readonly payments: readonly RentPayment[];
}
