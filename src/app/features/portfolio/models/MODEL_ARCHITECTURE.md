# Model Architecture - Visual Overview

## 🏗️ Type Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                      CORE ENTITIES                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Property                        RentPayment                │
│  ├─ id: string                   ├─ id: string             │
│  ├─ name: string                 ├─ propertyId: string     │
│  ├─ type: PropertyType           ├─ tenantId: string       │
│  ├─ status: PropertyStatus       ├─ amount: number         │
│  ├─ address: PropertyAddress     ├─ status: PaymentStatus  │
│  ├─ details: PropertyDetails     ├─ dueDate: Date          │
│  ├─ financials: PropertyFinancials├─ paidDate: Date | null │
│  ├─ tenant: Tenant | null        ├─ method: PaymentMethod  │
│  ├─ images: readonly string[]    ├─ history: PaymentHistory│
│  ├─ amenities: readonly string[] └─ ...                    │
│  └─ ...                                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     UNION TYPES                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PropertyStatus                  PaymentStatus             │
│  ├─ 'available'                  ├─ 'pending'              │
│  ├─ 'rented'                     ├─ 'paid'                 │
│  ├─ 'maintenance'                ├─ 'overdue'              │
│  └─ 'unavailable'                ├─ 'partially_paid'       │
│                                  ├─ 'cancelled'            │
│  PropertyType                    └─ 'refunded'             │
│  ├─ 'apartment'                                            │
│  ├─ 'house'                      PaymentMethod             │
│  ├─ 'studio'                     ├─ 'bank_transfer'        │
│  ├─ 'room'                       ├─ 'credit_card'          │
│  └─ 'commercial'                 ├─ 'debit_card'           │
│                                  ├─ 'cash'                 │
│  AlertType                       ├─ 'mobile_payment'       │
│  ├─ 'payment_overdue'            └─ 'check'                │
│  ├─ 'lease_expiring'                                       │
│  ├─ 'maintenance_required'       SortDirection             │
│  ├─ 'low_occupancy'              ├─ 'asc'                  │
│  ├─ 'payment_received'           └─ 'desc'                 │
│  └─ 'new_tenant'                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   FILTER MODELS                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PropertyFilters                 PaymentFilters            │
│  ├─ searchTerm: string           ├─ searchTerm: string     │
│  ├─ status: Status | null        ├─ status: Status | null  │
│  ├─ type: Type | null            ├─ propertyId: str | null │
│  ├─ city: string | null          ├─ dateFrom: Date | null  │
│  ├─ minRent: number | null       ├─ dateTo: Date | null    │
│  ├─ maxRent: number | null       ├─ minAmount: num | null  │
│  ├─ minBedrooms: num | null      ├─ maxAmount: num | null  │
│  └─ ...                          └─ ...                    │
│                                                             │
│  SortOptions<T>                  PaginationOptions         │
│  ├─ field: T                     ├─ page: number           │
│  └─ direction: SortDirection     ├─ pageSize: number       │
│                                  ├─ totalItems: number     │
│                                  └─ totalPages: number     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 AGGREGATED DATA                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PortfolioData                                              │
│  ├─ properties: readonly Property[]                         │
│  ├─ payments: readonly RentPayment[]                        │
│  ├─ statistics: PortfolioStatistics                         │
│  ├─ financials: FinancialSummary                            │
│  ├─ distribution: PropertyDistribution                      │
│  ├─ occupancyTrends: readonly OccupancyTrend[]              │
│  ├─ revenueTrends: readonly RevenueTrend[]                  │
│  ├─ tenantDemographics: TenantDemographics                  │
│  ├─ maintenanceSummary: MaintenanceSummary                  │
│  ├─ paymentSummary: PaymentSummary                          │
│  └─ lastUpdated: Date                                       │
│                                                             │
│  PortfolioStatistics            FinancialSummary            │
│  ├─ totalProperties             ├─ monthlyRevenue           │
│  ├─ availableProperties         ├─ yearlyRevenue            │
│  ├─ rentedProperties            ├─ collectedThisMonth       │
│  ├─ maintenanceProperties       ├─ pendingPayments          │
│  ├─ occupancyRate               ├─ overduePayments          │
│  ├─ totalMonthlyRevenue         ├─ totalDepositsHeld        │
│  ├─ averageRent                 ├─ averageCollectionTime    │
│  └─ totalSquareMeters           └─ revenueGrowth            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  VIEW MODELS                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BaseViewModel                                              │
│  ├─ loading: LoadingState                                   │
│  └─ error: ErrorState                                       │
│       │                                                     │
│       ├───► PortfolioViewModel                              │
│       │     ├─ properties                                   │
│       │     ├─ filteredProperties                           │
│       │     ├─ statistics                                   │
│       │     ├─ financials                                   │
│       │     ├─ filters                                      │
│       │     ├─ sort                                         │
│       │     ├─ pagination                                   │
│       │     └─ UI state flags                               │
│       │                                                     │
│       ├───► PaymentsViewModel                               │
│       │     ├─ payments                                     │
│       │     ├─ filteredPayments                             │
│       │     ├─ upcomingPayments                             │
│       │     ├─ overduePayments                              │
│       │     └─ computed totals                              │
│       │                                                     │
│       ├───► DashboardViewModel                              │
│       │     ├─ statistics                                   │
│       │     ├─ financials                                   │
│       │     ├─ performanceMetrics                           │
│       │     ├─ alerts                                       │
│       │     └─ trends                                       │
│       │                                                     │
│       └───► PropertyDetailViewModel                         │
│             ├─ property                                     │
│             ├─ payments                                     │
│             ├─ occupancyHistory                             │
│             └─ maintenanceRecords                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

```
┌──────────────┐
│   Service    │  Fetches raw data
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Raw Data    │  Property[], RentPayment[]
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Store     │  Manages state with BehaviorSubject
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Selectors   │  Observable streams
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  ViewModel   │  Combines data + filters + UI state
│   Builder    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Component   │  Consumes via async pipe
└──────────────┘
```

## 📊 Model Relationships

```
Property ─────┐
              │
              ├─► PortfolioData ─► PortfolioViewModel
              │
RentPayment ──┘

Property.id ←──── RentPayment.propertyId (Foreign Key)
Property.tenant.id ←──── RentPayment.tenantId (Foreign Key)
```

## 🎯 Type Safety Matrix

| Model | Readonly | Union Types | Nullable Fields | Immutable Arrays |
|-------|----------|-------------|-----------------|------------------|
| Property | ✅ | ✅ | ✅ | ✅ |
| RentPayment | ✅ | ✅ | ✅ | ✅ |
| PropertyFilters | ✅ | ✅ | ✅ | ✅ |
| PortfolioData | ✅ | ✅ | ❌ | ✅ |
| PortfolioViewModel | ✅ | ✅ | ✅ | ✅ |

## 🔐 Strict Typing Features

### 1. Readonly Properties
```typescript
interface Property {
  readonly id: string;  // Cannot be reassigned
}
```

### 2. Union Types
```typescript
type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'unavailable';
// Only these 4 values allowed - compile error for anything else
```

### 3. Nullable Fields
```typescript
interface Property {
  readonly tenant: Tenant | null;  // Explicitly nullable
}
```

### 4. Readonly Arrays
```typescript
interface Property {
  readonly images: readonly string[];  // Cannot push/pop
}
```

### 5. No Any Types
```typescript
// ❌ Not allowed
const data: any;

// ✅ Properly typed
const data: Property;
```

### 6. Nested Type Safety
```typescript
interface Property {
  readonly address: PropertyAddress;  // Nested interface
  readonly details: PropertyDetails;  // All nested types are also readonly
}
```

## 📈 Usage Statistics

```
Total Types: 50+
Union Types: 8
Interfaces: 40+
Type Guards: 4
Readonly Fields: 100%
Any Types: 0
```

## 🎓 Key Patterns

### Pattern 1: Nullable Foreign Keys
```typescript
interface Property {
  readonly tenant: Tenant | null;  // No tenant = null
}
```

### Pattern 2: Computed ViewModel
```typescript
interface PortfolioViewModel {
  readonly properties: readonly Property[];
  readonly hasProperties: boolean;  // Computed from properties.length
}
```

### Pattern 3: Filter Nullability
```typescript
interface PropertyFilters {
  readonly city: string | null;  // null = no filter
}
```

### Pattern 4: Status Unions
```typescript
type PaymentStatus = 'pending' | 'paid' | 'overdue';  // Exhaustive
```

### Pattern 5: Readonly Collections
```typescript
interface PortfolioData {
  readonly properties: readonly Property[];  // Immutable
}
```

## 🔍 Type Guard Examples

```typescript
function isPropertyViewModel(vm: BaseViewModel): vm is PortfolioViewModel {
  return 'properties' in vm;
}

function isPaymentViewModel(vm: BaseViewModel): vm is PaymentsViewModel {
  return 'payments' in vm;
}

function hasError(vm: BaseViewModel): boolean {
  return vm.error.hasError;
}
```

## 📝 Migration Path

```
Old Code (Untyped)
       ↓
Add Interfaces
       ↓
Add Readonly
       ↓
Add Union Types
       ↓
Add Nullable Types
       ↓
Full Type Safety ✅
```

## 🚀 Benefits Summary

✅ **Compile-Time Safety** - Catch errors before runtime
✅ **IntelliSense Support** - Full autocomplete in IDE
✅ **Refactoring Confidence** - Rename/restructure safely
✅ **Documentation** - Types serve as documentation
✅ **Immutability** - Prevent accidental mutations
✅ **Exhaustive Checking** - Union types ensure all cases handled
✅ **Null Safety** - Explicit nullable handling
✅ **Team Collaboration** - Clear contracts between code

---

This architecture provides **enterprise-grade type safety** for building robust, maintainable property management applications.
