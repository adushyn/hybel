/**
 * Property Status Union Type
 * Based on Hybel case requirements
 */
export type PropertyStatus =
  | 'available'
  | 'rented'
  | 'reserved';

/**
 * Property Type Union Type
 */
export type PropertyType =
  | 'flat'
  | 'house'
  | 'studio';

/**
 * Property Interface
 * Represents a rental property in a landlord's portfolio
 */
export interface Property {
  readonly id: string;
  readonly address: string;
  readonly city: string;
  readonly postalCode: string;
  readonly type: PropertyType;
  readonly status: PropertyStatus;
  readonly monthlyRent: number;
  readonly currency: 'NOK';
  readonly tenant: Tenant | null;
  readonly leaseExpires: Date | null;
  readonly images?: string[];  // Property image URLs
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Tenant Information
 */
export interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
}

/**
 * Property with computed fields
 */
export interface PropertyWithStatus extends Property {
  readonly needsAttention: boolean;
  readonly attentionReason: AttentionReason | null;
  readonly daysUntilLeaseExpiry: number | null;
  readonly hasOverduePayment: boolean;
}

/**
 * Attention Reason Union Type
 */
export type AttentionReason =
  | 'overdue_rent'
  | 'lease_expiring_soon'
  | 'lease_expired';

/**
 * Property Summary for landlord
 */
export interface PropertySummary {
  readonly address: string;
  readonly type: PropertyType;
  readonly status: PropertyStatus;
  readonly monthlyRent: number;
  readonly tenant: string | null;
  readonly leaseExpires: string | null;
  readonly needsAttention: boolean;
}
