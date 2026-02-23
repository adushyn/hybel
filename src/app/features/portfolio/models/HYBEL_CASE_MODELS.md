# Hybel Case - Strongly Typed Models

## Context

**Hybel** is a real-estate rental platform connecting landlords and tenants across Norway.

This document describes the strongly-typed TypeScript models for the **Landlord Dashboard - Portfolio Overview Component**.

## Case Requirements

The Portfolio Overview component gives landlords an at-a-glance view of their property portfolio, showing:

1. **Key portfolio metrics**: total properties, occupancy rate, monthly rental income
2. **Property-level breakdown**: status, tenant, rent, lease expiry
3. **Visual cues for attention items**: overdue rent, expiring leases
4. **Filtering and sorting**: by status, overdue payments, lease expiry

---

## Union Types

### PropertyStatus
```typescript
type PropertyStatus =
  | 'available'  // Property is vacant and ready to rent
  | 'rented'     // Property has an active tenant
  | 'reserved';  // Property is reserved (pending move-in)
```

### PaymentStatus
```typescript
type PaymentStatus =
  | 'paid'      // Rent has been paid
  | 'pending'   // Payment due but not yet overdue
  | 'overdue';  // Payment is past due date
```

### PropertyType
```typescript
type PropertyType =
  | 'flat'      // Apartment/flat
  | 'house'     // Detached house
  | 'studio';   // Studio apartment
```

### AttentionReason
```typescript
type AttentionReason =
  | 'overdue_rent'         // Tenant has overdue rent payment
  | 'lease_expiring_soon'  // Lease expires within 60 days
  | 'lease_expired';       // Lease has already expired
```

---

## Core Models

### 1. Property

Represents a rental property in the landlord's portfolio.

```typescript
interface Property {
  readonly id: string;
  readonly address: string;           // e.g., "Thereses gate 12, 0452 Oslo"
  readonly city: string;              // e.g., "Oslo"
  readonly postalCode: string;        // e.g., "0452"
  readonly type: PropertyType;        // flat | house | studio
  readonly status: PropertyStatus;    // available | rented | reserved
  readonly monthlyRent: number;       // Rent amount in NOK
  readonly currency: 'NOK';           // Norwegian Kroner
  readonly tenant: Tenant | null;     // null if not rented
  readonly leaseExpires: Date | null; // null if not rented
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
```

**Example:**
```typescript
const property: Property = {
  id: 'prop-1',
  address: 'Thereses gate 12',
  city: 'Oslo',
  postalCode: '0452',
  type: 'flat',
  status: 'rented',
  monthlyRent: 12500,
  currency: 'NOK',
  tenant: {
    id: 'tenant-1',
    name: 'Anna M.'
  },
  leaseExpires: new Date('2026-08-31'),
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### 2. Tenant

Basic tenant information.

```typescript
interface Tenant {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
}
```

### 3. RentPayment

Represents a monthly rent payment.

```typescript
interface RentPayment {
  readonly id: string;
  readonly propertyId: string;
  readonly propertyAddress: string;    // For display
  readonly tenantId: string;
  readonly tenantName: string;         // For display
  readonly amount: number;             // Payment amount in NOK
  readonly currency: 'NOK';
  readonly dueDate: Date;              // When payment is due
  readonly paidDate: Date | null;      // null if not paid yet
  readonly status: PaymentStatus;      // paid | pending | overdue
  readonly month: string;              // 'YYYY-MM' format
}
```

**Example:**
```typescript
const payment: RentPayment = {
  id: 'pay-1',
  propertyId: 'prop-1',
  propertyAddress: 'Thereses gate 12',
  tenantId: 'tenant-1',
  tenantName: 'Anna M.',
  amount: 12500,
  currency: 'NOK',
  dueDate: new Date('2025-02-01'),
  paidDate: new Date('2025-02-01'),
  status: 'paid',
  month: '2025-02'
};
```

### 4. PropertyWithStatus

Extended property with computed attention flags.

```typescript
interface PropertyWithStatus extends Property {
  readonly needsAttention: boolean;        // True if requires landlord action
  readonly attentionReason: AttentionReason | null;
  readonly daysUntilLeaseExpiry: number | null;
  readonly hasOverduePayment: boolean;
}
```

---

## Aggregate Models

### 5. PortfolioStatistics

Key metrics for the portfolio overview.

```typescript
interface PortfolioStatistics {
  readonly totalProperties: number;
  readonly availableProperties: number;
  readonly rentedProperties: number;
  readonly reservedProperties: number;
  readonly occupancyRate: number;           // Percentage (0-100)
  readonly totalMonthlyIncome: number;      // Sum of all rents
  readonly averageRent: number;             // Average rent per property
  readonly propertiesNeedingAttention: number;
}
```

**Example Calculation:**
```typescript
// With 6 properties, 4 rented:
{
  totalProperties: 6,
  availableProperties: 1,
  rentedProperties: 4,
  reservedProperties: 1,
  occupancyRate: 66.67,  // (4/6) * 100
  totalMonthlyIncome: 54400,
  averageRent: 13600,
  propertiesNeedingAttention: 2
}
```

### 6. PaymentSummary

Summary of payment statuses for current month.

```typescript
interface PaymentSummary {
  readonly totalExpected: number;    // Total rent expected
  readonly totalPaid: number;        // Amount already paid
  readonly totalPending: number;     // Amount pending
  readonly totalOverdue: number;     // Amount overdue
  readonly paidCount: number;        // Number of paid payments
  readonly pendingCount: number;     // Number of pending payments
  readonly overdueCount: number;     // Number of overdue payments
}
```

### 7. IncomeBreakdown

Financial overview for the month.

```typescript
interface IncomeBreakdown {
  readonly expectedMonthly: number;     // Total expected income
  readonly collectedThisMonth: number;  // Amount collected so far
  readonly pendingThisMonth: number;    // Amount still pending
  readonly overdueAmount: number;       // Amount overdue
}
```

### 8. PortfolioData

Complete dataset for the component.

```typescript
interface PortfolioData {
  readonly properties: readonly Property[];
  readonly payments: readonly RentPayment[];
  readonly statistics: PortfolioStatistics;
  readonly paymentSummary: PaymentSummary;
  readonly lastUpdated: Date;
}
```

---

## Filter & Sort Models

### 9. PropertyFilters

Filters for narrowing down the property list.

```typescript
interface PropertyFilters {
  readonly searchTerm: string;              // Search by address or tenant
  readonly status: PropertyStatus | null;   // Filter by status
  readonly type: PropertyType | null;       // Filter by type
  readonly city: string | null;             // Filter by city
  readonly hasOverduePayment: boolean;      // Show only with overdue payments
  readonly leaseExpiringSoon: boolean;      // Show only expiring within 60 days
  readonly needsAttention: boolean;         // Show only needing attention
}
```

### 10. SortOptions

Sorting configuration.

```typescript
interface SortOptions {
  readonly field: PropertySortField;
  readonly direction: SortDirection;
}

type PropertySortField =
  | 'address'
  | 'rent'
  | 'status'
  | 'leaseExpiry'
  | 'tenant';

type SortDirection = 'asc' | 'desc';
```

---

## ViewModel

### 11. PortfolioViewModel

Main ViewModel for the Portfolio Overview component.

```typescript
interface PortfolioViewModel extends BaseViewModel {
  // Core Data
  readonly properties: readonly PropertyWithStatus[];
  readonly filteredProperties: readonly PropertyWithStatus[];
  readonly payments: readonly RentPayment[];

  // Key Metrics (displayed at top of dashboard)
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

  // Quick Actions (badges/counts)
  readonly needsAttentionCount: number;
  readonly overduePaymentCount: number;
  readonly expiringSoonCount: number;
}
```

### Base ViewModel

```typescript
interface BaseViewModel {
  readonly loading: LoadingState;
  readonly error: ErrorState;
}

interface LoadingState {
  readonly isLoading: boolean;
  readonly loadingMessage: string | null;
}

interface ErrorState {
  readonly hasError: boolean;
  readonly errorMessage: string | null;
}
```

---

## Mock Data Mapping

Based on the Hybel case mock data:

### Properties Table → Property Model

| Case Field | Model Field | Type |
|------------|-------------|------|
| Address | `address` | string |
| Type | `type` | PropertyType |
| Status | `status` | PropertyStatus |
| Rent (NOK) | `monthlyRent` | number |
| Tenant | `tenant.name` | string \| null |
| Lease Expires | `leaseExpires` | Date \| null |

### Payments Table → RentPayment Model

| Case Field | Model Field | Type |
|------------|-------------|------|
| Property | `propertyAddress` | string |
| Tenant | `tenantName` | string |
| Amount (NOK) | `amount` | number |
| Due Date | `dueDate` | Date |
| Status | `status` | PaymentStatus |

---

## Usage Examples

### Creating a ViewModel

```typescript
const viewModel: PortfolioViewModel = {
  loading: { isLoading: false, loadingMessage: null },
  error: { hasError: false, errorMessage: null },

  properties: allProperties,
  filteredProperties: applyFilters(allProperties, filters),
  payments: currentMonthPayments,

  statistics: {
    totalProperties: 6,
    rentedProperties: 4,
    availableProperties: 1,
    reservedProperties: 1,
    occupancyRate: 66.67,
    totalMonthlyIncome: 54400,
    averageRent: 13600,
    propertiesNeedingAttention: 2
  },

  paymentSummary: {
    totalExpected: 54400,
    totalPaid: 30700,
    totalPending: 8900,
    totalOverdue: 14800,
    paidCount: 2,
    pendingCount: 1,
    overdueCount: 1
  },

  incomeBreakdown: {
    expectedMonthly: 54400,
    collectedThisMonth: 30700,
    pendingThisMonth: 8900,
    overdueAmount: 14800
  },

  filters: defaultFilters,
  sort: { field: 'address', direction: 'asc' },

  hasProperties: true,
  hasActiveFilters: false,
  showEmptyState: false,

  availableCities: ['Oslo', 'Bergen', 'Trondheim'],
  propertiesNeedingAttention: getAttentionProperties(allProperties),
  overduePayments: payments.filter(p => p.status === 'overdue'),
  upcomingLeaseExpiries: getExpiringLeases(allProperties, 60),

  needsAttentionCount: 2,
  overduePaymentCount: 1,
  expiringSoonCount: 1
};
```

### Filtering Example

```typescript
// Filter: Show only properties with overdue payments
const filters: PropertyFilters = {
  searchTerm: '',
  status: null,
  type: null,
  city: null,
  hasOverduePayment: true,  // ✅ Active filter
  leaseExpiringSoon: false,
  needsAttention: false
};

// Result: Only "Grünerløkka 45" (Erik S. - overdue payment)
```

---

## Type Safety Benefits

✅ **Union Types** - Only valid status values allowed
✅ **Readonly Properties** - Immutable data
✅ **Nullable Fields** - Explicit null handling
✅ **Strict Types** - No `any` types
✅ **Currency Safety** - Always 'NOK'
✅ **Date Objects** - Type-safe date handling

---

## Key Design Decisions

1. **Norwegian Context**: Currency fixed to 'NOK', addresses follow Norwegian format
2. **Attention System**: Built-in flags for items needing landlord action
3. **Filter-First**: Filters designed around landlord needs (overdue, expiring)
4. **Computed Fields**: ViewModel includes derived data (counts, percentages)
5. **Empty States**: Explicit handling for new landlords with no properties
6. **Immutability**: All fields readonly for predictable state management

---

This model structure supports the Hybel case requirements for a landlord dashboard portfolio overview component with strong TypeScript typing and clear separation of concerns.
