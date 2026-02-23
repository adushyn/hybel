import { PropertyStatus, PropertyType } from './property.model';
import { PaymentStatus } from './rent-payment.model';

/**
 * Property Filters
 * Used to filter properties in the landlord dashboard
 */
export interface PropertyFilters {
  readonly searchTerm: string;
  readonly status: PropertyStatus | null;
  readonly type: PropertyType | null;
  readonly city: string | null;
  readonly hasOverduePayment: boolean;
  readonly leaseExpiringSoon: boolean; // within 60 days
  readonly needsAttention: boolean;
}

/**
 * Payment Filters
 */
export interface PaymentFilters {
  readonly searchTerm: string;
  readonly status: PaymentStatus | null;
  readonly propertyId: string | null;
  readonly month: string | null;
}

/**
 * Sort Direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Property Sort Fields
 */
export type PropertySortField =
  | 'address'
  | 'rent'
  | 'status'
  | 'leaseExpiry'
  | 'tenant';

/**
 * Sort Options
 */
export interface SortOptions {
  readonly field: PropertySortField;
  readonly direction: SortDirection;
}

/**
 * Filter State
 */
export interface FilterState {
  readonly filters: PropertyFilters;
  readonly sort: SortOptions;
}
