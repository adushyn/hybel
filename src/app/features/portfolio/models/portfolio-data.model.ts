import { Property } from './property.model';
import { RentPayment, PaymentSummary } from './rent-payment.model';

/**
 * Portfolio Overview Statistics
 * Key metrics for landlord dashboard
 */
export interface PortfolioStatistics {
  readonly totalProperties: number;
  readonly availableProperties: number;
  readonly rentedProperties: number;
  readonly reservedProperties: number;
  readonly occupancyRate: number; // percentage
  readonly totalMonthlyIncome: number;
  readonly averageRent: number;
  readonly propertiesNeedingAttention: number;
}

/**
 * Portfolio Data
 * Complete dataset for the portfolio overview component
 */
export interface PortfolioData {
  readonly properties: readonly Property[];
  readonly payments: readonly RentPayment[];
  readonly statistics: PortfolioStatistics;
  readonly paymentSummary: PaymentSummary;
  readonly lastUpdated: Date;
}

/**
 * Property with Payment Info
 * Combined view of property and current payment status
 */
export interface PropertyWithPayment extends Property {
  readonly currentPayment: RentPayment | null;
  readonly hasOverduePayment: boolean;
  readonly needsAttention: boolean;
  readonly attentionReasons: readonly string[];
}

/**
 * Occupancy Breakdown
 */
export interface OccupancyBreakdown {
  readonly rented: number;
  readonly available: number;
  readonly reserved: number;
  readonly rentedPercentage: number;
}

/**
 * Income Breakdown
 */
export interface IncomeBreakdown {
  readonly expectedMonthly: number;
  readonly collectedThisMonth: number;
  readonly pendingThisMonth: number;
  readonly overdueAmount: number;
}

/**
 * Property Distribution by Type
 */
export interface PropertyDistribution {
  readonly byType: Map<string, number>;
  readonly byCity: Map<string, number>;
  readonly byStatus: Map<string, number>;
}
