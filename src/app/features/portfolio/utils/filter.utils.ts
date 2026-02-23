import { Property, PropertyWithStatus } from '../models/property.model';
import { RentPayment } from '../models/rent-payment.model';
import { PropertyFilters } from '../models/filters.model';

/**
 * Pure filtering utilities for property management
 * No Angular dependencies - easily testable
 */

/**
 * Check if a payment is overdue
 * Rule: Payment status is 'overdue'
 *
 * @param payment - Payment to check
 * @returns true if payment is overdue
 */
export function isOverdue(payment: RentPayment): boolean {
  return payment.status === 'overdue';
}

/**
 * Check if a property has an overdue payment
 *
 * @param property - Property to check
 * @param payments - All payments
 * @returns true if property has at least one overdue payment
 */
export function hasOverduePayment(
  property: Property,
  payments: readonly RentPayment[]
): boolean {
  return payments.some(
    payment => payment.propertyId === property.id && isOverdue(payment)
  );
}

/**
 * Check if a lease is expiring soon
 * Rule: Lease expires in <= 60 days
 *
 * @param leaseExpires - Lease expiration date
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns true if lease expires within 60 days
 */
export function isExpiringSoon(
  leaseExpires: Date | null,
  referenceDate: Date = new Date()
): boolean {
  if (!leaseExpires) return false;

  const today = new Date(referenceDate);
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  return leaseExpires <= sixtyDaysFromNow && leaseExpires > today;
}

/**
 * Calculate days until lease expiry
 *
 * @param leaseExpires - Lease expiration date
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Number of days until expiry, or null if no lease expiration
 */
export function daysUntilExpiry(
  leaseExpires: Date | null,
  referenceDate: Date = new Date()
): number | null {
  if (!leaseExpires) return null;

  const today = new Date(referenceDate);
  const diffTime = leaseExpires.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a lease has expired
 *
 * @param leaseExpires - Lease expiration date
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns true if lease has expired
 */
export function isLeaseExpired(
  leaseExpires: Date | null,
  referenceDate: Date = new Date()
): boolean {
  if (!leaseExpires) return false;

  const days = daysUntilExpiry(leaseExpires, referenceDate);
  return days !== null && days < 0;
}

/**
 * Check if a property needs attention
 * Property needs attention if:
 * - Has overdue payment, OR
 * - Lease is expiring soon (within 60 days), OR
 * - Lease has expired
 *
 * @param property - Property to check
 * @param payments - All payments
 * @returns true if property needs attention
 */
export function needsAttention(
  property: Property,
  payments: readonly RentPayment[]
): boolean {
  const hasOverdue = hasOverduePayment(property, payments);
  const expiringSoon = isExpiringSoon(property.leaseExpires);
  const expired = isLeaseExpired(property.leaseExpires);

  return hasOverdue || expiringSoon || expired;
}

/**
 * Filter properties by search term
 * Searches in: address, city, tenant name
 *
 * @param properties - Properties to filter
 * @param searchTerm - Search term (case-insensitive)
 * @returns Filtered properties
 */
export function filterBySearchTerm(
  properties: readonly PropertyWithStatus[],
  searchTerm: string
): PropertyWithStatus[] {
  if (!searchTerm) return [...properties];

  const searchLower = searchTerm.toLowerCase();
  return properties.filter(property =>
    property.address.toLowerCase().includes(searchLower) ||
    property.city.toLowerCase().includes(searchLower) ||
    property.tenant?.name.toLowerCase().includes(searchLower)
  );
}

/**
 * Filter properties by status
 *
 * @param properties - Properties to filter
 * @param status - Status to filter by
 * @returns Filtered properties
 */
export function filterByStatus(
  properties: readonly PropertyWithStatus[],
  status: string | null
): PropertyWithStatus[] {
  if (!status) return [...properties];
  return properties.filter(property => property.status === status);
}

/**
 * Filter properties by type
 *
 * @param properties - Properties to filter
 * @param type - Type to filter by
 * @returns Filtered properties
 */
export function filterByType(
  properties: readonly PropertyWithStatus[],
  type: string | null
): PropertyWithStatus[] {
  if (!type) return [...properties];
  return properties.filter(property => property.type === type);
}

/**
 * Filter properties by city
 *
 * @param properties - Properties to filter
 * @param city - City to filter by
 * @returns Filtered properties
 */
export function filterByCity(
  properties: readonly PropertyWithStatus[],
  city: string | null
): PropertyWithStatus[] {
  if (!city) return [...properties];
  return properties.filter(property => property.city === city);
}

/**
 * Filter properties with overdue payments
 *
 * @param properties - Properties to filter
 * @returns Properties with overdue payments
 */
export function filterWithOverduePayments(
  properties: readonly PropertyWithStatus[]
): PropertyWithStatus[] {
  return properties.filter(property => property.hasOverduePayment);
}

/**
 * Filter properties with leases expiring soon
 * Rule: Lease expires in <= 60 days
 *
 * @param properties - Properties to filter
 * @returns Properties with leases expiring within 60 days
 */
export function filterExpiringSoon(
  properties: readonly PropertyWithStatus[]
): PropertyWithStatus[] {
  return properties.filter(
    property =>
      property.daysUntilLeaseExpiry !== null &&
      property.daysUntilLeaseExpiry > 0 &&
      property.daysUntilLeaseExpiry <= 60
  );
}

/**
 * Filter properties that need attention
 *
 * @param properties - Properties to filter
 * @returns Properties that need attention
 */
export function filterNeedsAttention(
  properties: readonly PropertyWithStatus[]
): PropertyWithStatus[] {
  return properties.filter(property => property.needsAttention);
}

/**
 * Apply all filters to properties
 * Main filtering function that applies all filter criteria
 *
 * @param properties - Properties to filter
 * @param filters - Filter criteria
 * @returns Filtered properties
 */
export function applyFilters(
  properties: readonly PropertyWithStatus[],
  filters: PropertyFilters
): PropertyWithStatus[] {
  let filtered = [...properties];

  // Apply search term filter
  if (filters.searchTerm) {
    filtered = filterBySearchTerm(filtered, filters.searchTerm);
  }

  // Apply status filter
  if (filters.status) {
    filtered = filterByStatus(filtered, filters.status);
  }

  // Apply type filter
  if (filters.type) {
    filtered = filterByType(filtered, filters.type);
  }

  // Apply city filter
  if (filters.city) {
    filtered = filterByCity(filtered, filters.city);
  }

  // Apply overdue payment filter
  if (filters.hasOverduePayment) {
    filtered = filterWithOverduePayments(filtered);
  }

  // Apply lease expiring soon filter
  if (filters.leaseExpiringSoon) {
    filtered = filterExpiringSoon(filtered);
  }

  // Apply needs attention filter
  if (filters.needsAttention) {
    filtered = filterNeedsAttention(filtered);
  }

  return filtered;
}

/**
 * Check if any filters are active
 *
 * @param filters - Filter state
 * @returns true if any filter is active
 */
export function hasActiveFilters(filters: PropertyFilters): boolean {
  return !!(
    filters.searchTerm ||
    filters.status ||
    filters.type ||
    filters.city ||
    filters.hasOverduePayment ||
    filters.leaseExpiringSoon ||
    filters.needsAttention
  );
}
