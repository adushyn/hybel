import { Property, PropertyWithStatus } from './property.model';
import { RentPayment, PaymentSummary } from './rent-payment.model';
import { PropertyFilters, SortOptions } from './filters.model';
import { PortfolioStatistics, IncomeBreakdown } from './portfolio-data.model';

/**
 * Loading State
 */
export interface LoadingState {
  readonly isLoading: boolean;
  readonly loadingMessage: string | null;
}

/**
 * Error State
 */
export interface ErrorState {
  readonly hasError: boolean;
  readonly errorMessage: string | null;
}

/**
 * Base ViewModel
 */
export interface BaseViewModel {
  readonly loading: LoadingState;
  readonly error: ErrorState;
}

/**
 * Portfolio Overview ViewModel
 * Main ViewModel for the landlord dashboard portfolio component
 */
export interface PortfolioViewModel extends BaseViewModel {
  // Core Data
  readonly properties: readonly PropertyWithStatus[];
  readonly filteredProperties: readonly PropertyWithStatus[];
  readonly payments: readonly RentPayment[];

  // Key Metrics
  readonly statistics: PortfolioStatistics;
  readonly paymentSummary: PaymentSummary;
  readonly incomeBreakdown: IncomeBreakdown;

  // Filters & Sorting
  readonly filters: PropertyFilters;
  readonly sort: SortOptions;

  // UI State
  readonly hasProperties: boolean;
  readonly hasActiveFilters: boolean;
  readonly showEmptyState: boolean;

  // Computed/Derived Data
  readonly availableCities: readonly string[];
  readonly propertiesNeedingAttention: readonly PropertyWithStatus[];
  readonly overduePayments: readonly RentPayment[];
  readonly upcomingLeaseExpiries: readonly PropertyWithStatus[];

  // Quick Actions
  readonly needsAttentionCount: number;
  readonly overduePaymentCount: number;
  readonly expiringSoonCount: number;
}

/**
 * Property Detail ViewModel
 * For viewing a single property's details
 */
export interface PropertyDetailViewModel extends BaseViewModel {
  readonly property: Property | null;
  readonly currentPayment: RentPayment | null;
  readonly paymentHistory: readonly RentPayment[];
  readonly hasProperty: boolean;
  readonly hasTenant: boolean;
  readonly daysUntilLeaseExpiry: number | null;
  readonly needsAttention: boolean;
  readonly attentionReasons: readonly string[];
}

/**
 * Empty State ViewModel
 */
export interface EmptyStateViewModel {
  readonly title: string;
  readonly message: string;
  readonly actionLabel?: string;
  readonly actionCallback?: () => void;
}

/**
 * Attention Item
 * Represents something that needs the landlord's attention
 */
export interface AttentionItem {
  readonly propertyId: string;
  readonly propertyAddress: string;
  readonly reason: 'overdue_rent' | 'lease_expiring_soon' | 'lease_expired';
  readonly severity: 'high' | 'medium' | 'low';
  readonly message: string;
  readonly actionLabel: string;
}

/**
 * Dashboard Quick Stats
 */
export interface QuickStats {
  readonly totalProperties: number;
  readonly occupancyRate: number;
  readonly monthlyIncome: number;
  readonly needsAttention: number;
}

/**
 * Type Guards
 */
export function isLoading(vm: BaseViewModel): boolean {
  return vm.loading.isLoading;
}

export function hasError(vm: BaseViewModel): boolean {
  return vm.error.hasError;
}

export function hasData(vm: PortfolioViewModel): boolean {
  return vm.properties.length > 0;
}
