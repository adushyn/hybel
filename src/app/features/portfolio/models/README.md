# Property Portfolio Models - Type Documentation

## Overview

This directory contains **strictly typed** TypeScript models for a property management/rental portfolio system. All models use:

- ✅ `readonly` properties for immutability
- ✅ Union types for constrained values
- ✅ Strict TypeScript mode
- ✅ No `any` types
- ✅ Comprehensive type safety

## Model Structure

```
models/
├── property.model.ts          # Property entities and related types
├── rent-payment.model.ts      # Payment entities and financial types
├── filters.model.ts           # Filter and sorting types
├── portfolio-data.model.ts    # Aggregated data and statistics
├── portfolio-view.model.ts    # ViewModel types for UI
└── index.ts                   # Public API
```

## Core Models

### 1. Property Model (`property.model.ts`)

**Union Types:**
```typescript
type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'unavailable';
type PropertyType = 'apartment' | 'house' | 'studio' | 'room' | 'commercial';
```

**Main Interface:**
```typescript
interface Property {
  readonly id: string;
  readonly name: string;
  readonly type: PropertyType;
  readonly status: PropertyStatus;
  readonly address: PropertyAddress;
  readonly details: PropertyDetails;
  readonly financials: PropertyFinancials;
  readonly tenant: Tenant | null;
  readonly images: readonly string[];
  readonly amenities: readonly string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
```

**Key Features:**
- All properties are `readonly`
- Arrays use `readonly` for immutability
- `tenant` can be `null` (no tenant)
- Nested interfaces for complex structures

**Sub-interfaces:**
- `PropertyAddress` - Full address with coordinates
- `PropertyDetails` - Physical characteristics (bedrooms, sqm, etc.)
- `PropertyFinancials` - Rent, deposit, utilities
- `Tenant` - Current tenant information
- `EmergencyContact` - Tenant emergency contact

### 2. Rent Payment Model (`rent-payment.model.ts`)

**Union Types:**
```typescript
type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'partially_paid'
  | 'cancelled'
  | 'refunded';

type PaymentMethod =
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'mobile_payment'
  | 'check';
```

**Main Interface:**
```typescript
interface RentPayment {
  readonly id: string;
  readonly propertyId: string;
  readonly tenantId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly dueDate: Date;
  readonly paidDate: Date | null;
  readonly method: PaymentMethod | null;
  readonly reference: string;
  readonly description: string;
  readonly lateFee: number;
  readonly discount: number;
  readonly totalAmount: number;
  readonly remainingAmount: number;
  readonly history: readonly PaymentHistory[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
```

**Key Features:**
- `paidDate` and `method` nullable (unpaid payments)
- Complete payment history tracking
- Late fees and discounts
- Total and remaining amounts

**Related Types:**
- `PaymentHistory` - Transaction history
- `PaymentSummary` - Aggregated payment statistics
- `MonthlyPaymentReport` - Monthly collection reports
- `PaymentReminder` - Payment reminder tracking

### 3. Filters Model (`filters.model.ts`)

**Property Filters:**
```typescript
interface PropertyFilters {
  readonly searchTerm: string;
  readonly status: PropertyStatus | null;
  readonly type: PropertyType | null;
  readonly city: string | null;
  readonly minRent: number | null;
  readonly maxRent: number | null;
  readonly minBedrooms: number | null;
  readonly maxBedrooms: number | null;
  readonly minSquareMeters: number | null;
  readonly maxSquareMeters: number | null;
  readonly furnished: boolean | null;
  readonly petsAllowed: boolean | null;
  readonly parkingRequired: boolean | null;
  readonly amenities: readonly string[];
}
```

**Payment Filters:**
```typescript
interface PaymentFilters {
  readonly searchTerm: string;
  readonly status: PaymentStatus | null;
  readonly propertyId: string | null;
  readonly tenantId: string | null;
  readonly dateFrom: Date | null;
  readonly dateTo: Date | null;
  readonly minAmount: number | null;
  readonly maxAmount: number | null;
  readonly overdueOnly: boolean;
  readonly method: string | null;
}
```

**Key Features:**
- Nullable filters (null = no filter applied)
- Type-safe filter values
- Boolean flags for specific conditions
- Date range filtering

**Sorting & Pagination:**
```typescript
type SortDirection = 'asc' | 'desc';

interface SortOptions<T = string> {
  readonly field: T;
  readonly direction: SortDirection;
}

interface PaginationOptions {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}
```

### 4. Portfolio Data Model (`portfolio-data.model.ts`)

**Main Interface:**
```typescript
interface PortfolioData {
  readonly properties: readonly Property[];
  readonly payments: readonly RentPayment[];
  readonly statistics: PortfolioStatistics;
  readonly financials: FinancialSummary;
  readonly distribution: PropertyDistribution;
  readonly occupancyTrends: readonly OccupancyTrend[];
  readonly revenueTrends: readonly RevenueTrend[];
  readonly tenantDemographics: TenantDemographics;
  readonly maintenanceSummary: MaintenanceSummary;
  readonly paymentSummary: PaymentSummary;
  readonly lastUpdated: Date;
}
```

**Key Statistics:**
```typescript
interface PortfolioStatistics {
  readonly totalProperties: number;
  readonly availableProperties: number;
  readonly rentedProperties: number;
  readonly maintenanceProperties: number;
  readonly occupancyRate: number;
  readonly totalMonthlyRevenue: number;
  readonly averageRent: number;
  readonly totalSquareMeters: number;
}

interface FinancialSummary {
  readonly monthlyRevenue: number;
  readonly yearlyRevenue: number;
  readonly collectedThisMonth: number;
  readonly pendingPayments: number;
  readonly overduePayments: number;
  readonly totalDepositsHeld: number;
  readonly averageCollectionTime: number;
  readonly revenueGrowth: number;
}
```

**Performance Metrics:**
```typescript
interface PortfolioPerformanceMetrics {
  readonly roi: number;
  readonly capRate: number;
  readonly cashFlow: number;
  readonly netOperatingIncome: number;
  readonly vacancyRate: number;
  readonly maintenanceRatio: number;
}
```

**Alerts:**
```typescript
type AlertType =
  | 'payment_overdue'
  | 'lease_expiring'
  | 'maintenance_required'
  | 'low_occupancy'
  | 'payment_received'
  | 'new_tenant';

type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

interface PortfolioAlert {
  readonly id: string;
  readonly type: AlertType;
  readonly severity: AlertSeverity;
  readonly title: string;
  readonly message: string;
  readonly propertyId?: string;
  readonly paymentId?: string;
  readonly createdAt: Date;
  readonly acknowledged: boolean;
}
```

### 5. Portfolio ViewModel (`portfolio-view.model.ts`)

**Base ViewModel:**
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
  readonly errorCode: string | null;
}
```

**Portfolio Overview ViewModel:**
```typescript
interface PortfolioViewModel extends BaseViewModel {
  // Data
  readonly properties: readonly Property[];
  readonly filteredProperties: readonly Property[];
  readonly statistics: PortfolioStatistics;
  readonly financials: FinancialSummary;
  readonly distribution: PropertyDistribution;
  readonly alerts: readonly PortfolioAlert[];
  readonly performanceMetrics: PortfolioPerformanceMetrics;

  // Filters & Sorting
  readonly filters: PropertyFilters;
  readonly sort: SortOptions;
  readonly pagination: PaginationOptions;

  // UI State
  readonly hasProperties: boolean;
  readonly hasActiveFilters: boolean;
  readonly showEmptyState: boolean;
  readonly selectedPropertyId: string | null;

  // Computed Properties
  readonly availableStatusOptions: readonly PropertyStatus[];
  readonly availableCities: readonly string[];
  readonly availableAmenities: readonly string[];
  readonly priceRange: PriceRange;

  // Quick Stats
  readonly quickStats: QuickStats;
}
```

**Other ViewModels:**
- `PropertyDetailViewModel` - Single property view with history
- `PaymentsViewModel` - Payment list and filtering
- `DashboardViewModel` - Dashboard overview
- `PropertyFormViewModel` - Property form state
- `PaymentFormViewModel` - Payment form state

**Type Guards:**
```typescript
function isLoadingState(vm: BaseViewModel): boolean;
function hasError(vm: BaseViewModel): boolean;
function isPropertyViewModel(vm: BaseViewModel): vm is PortfolioViewModel;
function isPaymentViewModel(vm: BaseViewModel): vm is PaymentsViewModel;
```

## Usage Examples

### Creating a Property

```typescript
const property: Property = {
  id: '123',
  name: 'Downtown Apartment',
  type: 'apartment',
  status: 'rented',
  address: {
    street: '123 Main St',
    city: 'Oslo',
    postalCode: '0150',
    country: 'Norway'
  },
  details: {
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 75,
    furnished: true,
    petsAllowed: false,
    smokingAllowed: false,
    parkingSpaces: 1,
    description: 'Modern apartment in city center'
  },
  financials: {
    monthlyRent: 15000,
    deposit: 30000,
    currency: 'NOK',
    utilities: {
      included: ['water', 'heating'],
      excluded: ['electricity', 'internet'],
      estimatedMonthlyCost: 1500
    }
  },
  tenant: {
    id: 'tenant-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+47 123 45 678',
    leaseStart: new Date('2024-01-01'),
    leaseEnd: new Date('2025-01-01'),
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+47 987 65 432',
      relationship: 'Spouse'
    }
  },
  images: ['url1', 'url2'],
  amenities: ['gym', 'elevator', 'balcony'],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Creating a Payment

```typescript
const payment: RentPayment = {
  id: 'pay-123',
  propertyId: '123',
  tenantId: 'tenant-1',
  amount: 15000,
  currency: 'NOK',
  status: 'paid',
  dueDate: new Date('2024-01-01'),
  paidDate: new Date('2024-01-01'),
  method: 'bank_transfer',
  reference: 'REF-001',
  description: 'January 2024 rent',
  lateFee: 0,
  discount: 0,
  totalAmount: 15000,
  remainingAmount: 0,
  history: [],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Using Filters

```typescript
const filters: PropertyFilters = {
  searchTerm: '',
  status: 'rented',
  type: null,
  city: 'Oslo',
  minRent: 10000,
  maxRent: 20000,
  minBedrooms: 2,
  maxBedrooms: null,
  minSquareMeters: null,
  maxSquareMeters: null,
  furnished: true,
  petsAllowed: null,
  parkingRequired: false,
  amenities: ['gym', 'elevator']
};
```

### Building a ViewModel

```typescript
const viewModel: PortfolioViewModel = {
  loading: {
    isLoading: false,
    loadingMessage: null
  },
  error: {
    hasError: false,
    errorMessage: null,
    errorCode: null
  },
  properties: allProperties,
  filteredProperties: filteredProperties,
  statistics: calculateStatistics(allProperties),
  financials: calculateFinancials(payments),
  distribution: calculateDistribution(allProperties),
  alerts: getActiveAlerts(),
  performanceMetrics: calculateMetrics(),
  filters: currentFilters,
  sort: { field: 'name', direction: 'asc' },
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 50,
    totalPages: 5
  },
  hasProperties: allProperties.length > 0,
  hasActiveFilters: checkActiveFilters(currentFilters),
  showEmptyState: filteredProperties.length === 0,
  selectedPropertyId: null,
  availableStatusOptions: ['available', 'rented', 'maintenance', 'unavailable'],
  availableCities: extractUniqueCities(allProperties),
  availableAmenities: extractUniqueAmenities(allProperties),
  priceRange: calculatePriceRange(allProperties),
  quickStats: {
    rentedToday: 0,
    paymentsToday: 5,
    maintenanceActive: 2,
    alertsUnread: 3
  }
};
```

## Type Safety Benefits

### Compile-Time Checks

```typescript
// ✅ Valid
const status: PropertyStatus = 'rented';

// ❌ Compile error - not in union type
const invalidStatus: PropertyStatus = 'invalid';

// ✅ Nullable handling
const tenant: Tenant | null = property.tenant;
if (tenant) {
  console.log(tenant.name); // Safe access
}

// ✅ Readonly arrays
property.images.push('new'); // ❌ Compile error
const newImages = [...property.images, 'new']; // ✅ Create new array
```

### Type Narrowing

```typescript
function processPayment(payment: RentPayment): void {
  if (payment.status === 'paid') {
    // TypeScript knows paidDate should exist
    console.log(payment.paidDate); // Date | null
  }
}
```

### Exhaustive Switch

```typescript
function getStatusColor(status: PropertyStatus): string {
  switch (status) {
    case 'available':
      return 'green';
    case 'rented':
      return 'blue';
    case 'maintenance':
      return 'orange';
    case 'unavailable':
      return 'red';
    // TypeScript ensures all cases are covered
  }
}
```

## Immutability Patterns

```typescript
// ❌ Mutation (compile error with readonly)
property.status = 'available'; // Error

// ✅ Immutable update
const updatedProperty: Property = {
  ...property,
  status: 'available',
  updatedAt: new Date()
};

// ✅ Array updates
const newAmenities = [...property.amenities, 'pool'];
const updatedWithAmenities = {
  ...property,
  amenities: newAmenities
};
```

## Best Practices

1. **Always use readonly**: Enforces immutability
2. **Use union types**: Instead of enums or strings
3. **Nullable vs undefined**: Use `| null` for nullable fields
4. **Readonly arrays**: Use `readonly Type[]` for arrays
5. **No any types**: Every field must be typed
6. **Use Date objects**: Not strings for dates
7. **Nested interfaces**: Break complex types into smaller ones
8. **Type guards**: Use for runtime type checking

## Testing

```typescript
describe('Property Model', () => {
  it('should enforce readonly properties', () => {
    const property: Property = createMockProperty();

    // These should not compile:
    // property.status = 'available';
    // property.images.push('new');
  });

  it('should handle nullable tenant', () => {
    const property: Property = {
      ...createMockProperty(),
      tenant: null
    };

    expect(property.tenant).toBeNull();
  });
});
```

## Migration from Untyped Code

```typescript
// Before (untyped)
const property = {
  status: 'some-status', // Any string allowed
  tenant: {},            // Any object
  images: []             // Mutable
};

// After (typed)
const property: Property = {
  status: 'rented',      // Only PropertyStatus allowed
  tenant: validTenant,   // Must be Tenant | null
  images: ['url'] as const // Immutable
};
```

---

These models provide **compile-time safety**, **runtime predictability**, and **excellent IDE support** for building robust property management applications.
