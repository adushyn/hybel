import { Property, PropertyWithStatus } from './models/property.model';
import { RentPayment, PaymentSummary } from './models/rent-payment.model';
import { PropertyFilters } from './models/filters.model';
import { PortfolioStatistics, IncomeBreakdown } from './models/portfolio-data.model';
import { PortfolioViewModel } from './models/portfolio-view.model';
import * as FilterUtils from './utils/filter.utils';
import * as MetricsUtils from './utils/metrics.utils';

/**
 * Pure function to calculate portfolio statistics
 * Uses metrics utilities for consistent calculations
 */
export function calculateStatistics(
  properties: readonly Property[],
  payments: readonly RentPayment[]
): PortfolioStatistics {
  // Use pure metrics utilities
  const metrics = MetricsUtils.calculateMetrics(properties);
  const statusCounts = MetricsUtils.countByStatus(properties);
  const averageRent = MetricsUtils.calculateAverageRent(properties);

  // Count properties needing attention using filter utility
  const propertiesNeedingAttention = properties.filter(property =>
    FilterUtils.needsAttention(property, payments)
  ).length;

  return {
    totalProperties: metrics.totalProperties,
    availableProperties: statusCounts.available,
    rentedProperties: statusCounts.rented,
    reservedProperties: statusCounts.reserved,
    occupancyRate: metrics.occupancyRate,
    totalMonthlyIncome: metrics.monthlyIncome,
    averageRent,
    propertiesNeedingAttention
  };
}

/**
 * Pure function to calculate payment summary
 */
export function calculatePaymentSummary(
  payments: readonly RentPayment[]
): PaymentSummary {
  const totalExpected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const paidCount = payments.filter(p => p.status === 'paid').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  return {
    totalExpected,
    totalPaid,
    totalPending,
    totalOverdue,
    paidCount,
    pendingCount,
    overdueCount
  };
}

/**
 * Pure function to add status information to a property
 * Uses filter utilities for consistent logic
 */
export function addStatusToProperty(
  property: Property,
  payments: readonly RentPayment[]
): PropertyWithStatus {
  // Use utility functions for consistent logic
  const hasOverdue = FilterUtils.hasOverduePayment(property, payments);
  const daysUntilLeaseExpiry = FilterUtils.daysUntilExpiry(property.leaseExpires);
  const expiringSoon = FilterUtils.isExpiringSoon(property.leaseExpires);
  const expired = FilterUtils.isLeaseExpired(property.leaseExpires);

  // Determine attention reason (priority: overdue > expired > expiring soon)
  let attentionReason: 'overdue_rent' | 'lease_expiring_soon' | 'lease_expired' | null = null;
  let needsAttention = false;

  if (hasOverdue) {
    needsAttention = true;
    attentionReason = 'overdue_rent';
  } else if (expired) {
    needsAttention = true;
    attentionReason = 'lease_expired';
  } else if (expiringSoon) {
    needsAttention = true;
    attentionReason = 'lease_expiring_soon';
  }

  return {
    ...property,
    needsAttention,
    attentionReason,
    daysUntilLeaseExpiry,
    hasOverduePayment: hasOverdue
  };
}

/**
 * Pure function to apply filters to properties
 * Delegates to filter utilities for consistency
 */
export function applyFilters(
  properties: readonly PropertyWithStatus[],
  filters: PropertyFilters
): PropertyWithStatus[] {
  return FilterUtils.applyFilters(properties, filters);
}

/**
 * Pure function to build PortfolioViewModel
 *
 * This is the main orchestration function that:
 * - Takes raw data (properties, payments)
 * - Takes UI state (filters, loading, error)
 * - Returns a complete, strongly-typed ViewModel
 *
 * All business logic is contained here, making it:
 * - Framework-agnostic (no Angular dependencies)
 * - Easily testable (pure function)
 * - Reusable across different contexts
 *
 * @param properties - Raw property data
 * @param payments - Raw payment data
 * @param filters - Current filter state
 * @param loading - Loading flag
 * @param error - Error message or null
 * @returns Complete PortfolioViewModel
 */
export function buildViewModel(
  properties: readonly Property[],
  payments: readonly RentPayment[],
  filters: PropertyFilters,
  loading: boolean,
  error: string | null
): PortfolioViewModel {
  // Step 1: Calculate statistics and payment summary
  const statistics = calculateStatistics(properties, payments);
  const paymentSummary = calculatePaymentSummary(payments);

  // Step 2: Add status information to all properties
  const propertiesWithStatus = properties.map(property =>
    addStatusToProperty(property, payments)
  );

  // Step 3: Apply filters
  const filteredProperties = applyFilters(propertiesWithStatus, filters);

  // Step 4: Calculate income breakdown
  const incomeBreakdown: IncomeBreakdown = {
    expectedMonthly: paymentSummary.totalExpected,
    collectedThisMonth: paymentSummary.totalPaid,
    pendingThisMonth: paymentSummary.totalPending,
    overdueAmount: paymentSummary.totalOverdue
  };

  // Step 5: Extract unique cities
  const availableCities = Array.from(
    new Set(propertiesWithStatus.map(p => p.city))
  ).sort();

  // Step 6: Get attention properties
  const propertiesNeedingAttention = propertiesWithStatus.filter(p => p.needsAttention);
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const upcomingLeaseExpiries = propertiesWithStatus.filter(
    p => p.daysUntilLeaseExpiry !== null &&
         p.daysUntilLeaseExpiry > 0 &&
         p.daysUntilLeaseExpiry <= 60
  );

  // Step 7: Check for active filters using utility function
  const hasActiveFilters = FilterUtils.hasActiveFilters(filters);

  // Step 8: Return complete ViewModel
  return {
    // Loading & Error State
    loading: {
      isLoading: loading,
      loadingMessage: loading ? 'Loading portfolio data...' : null
    },
    error: {
      hasError: !!error,
      errorMessage: error
    },

    // Core Data
    properties: propertiesWithStatus,
    filteredProperties,
    payments: [...payments],

    // Key Metrics
    statistics,
    paymentSummary,
    incomeBreakdown,

    // Filters & Sorting
    filters,
    sort: { field: 'address', direction: 'asc' },

    // UI State
    hasProperties: propertiesWithStatus.length > 0,
    hasActiveFilters,
    showEmptyState: filteredProperties.length === 0,

    // Computed/Derived Data
    availableCities,
    propertiesNeedingAttention,
    overduePayments: [...overduePayments],
    upcomingLeaseExpiries,

    // Quick Actions
    needsAttentionCount: propertiesNeedingAttention.length,
    overduePaymentCount: overduePayments.length,
    expiringSoonCount: upcomingLeaseExpiries.length
  };
}
