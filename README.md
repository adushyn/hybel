# Hybel - Property Management Application

A modern property management application built with Angular 19, featuring portfolio management, tenant tracking, and payment monitoring.

## 🚀 Features

### Core Features
- ✅ **Portfolio Dashboard** - Overview of all properties with key metrics
- ✅ **Property Management** - View, filter, and manage rental properties
- ✅ **Tenant Tracking** - Monitor tenant information and lease details
- ✅ **Payment Monitoring** - Track rent payments and overdue status
- ✅ **Customer Profile** - User profile with photo upload functionality
- ✅ **Property Details** - Detailed property views with image carousel
- ✅ **Advanced Filtering** - Filter by status, type, city, payment status
- ✅ **Table Sorting** - Sort properties by any column (address, status, rent, etc.)
- ✅ **Dual View Modes** - Switch between table and card views

### UI/UX Features
- ✅ **Custom Snack Bar System** - Material Design notifications (success, error, warning, info)
- ✅ **404 Not Found Page** - Professional error page for invalid routes
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **Clickable Rows** - Enhanced table interactions with hover/focus states
- ✅ **Loading States** - Progress spinners for async operations
- ✅ **Image Gallery** - Carousel with zoom functionality
- ✅ **Empty States** - User-friendly messages for missing data

### Technical Features
- ✅ **Angular 19** - Latest Angular version with standalone components
- ✅ **Angular Signals** - Reactive state management
- ✅ **OnPush Change Detection** - Optimized performance
- ✅ **Material Design 3** - Modern UI components
- ✅ **RxJS Observables** - Reactive data streams
- ✅ **Lazy Loading** - Code splitting for better performance
- ✅ **TypeScript** - Type-safe development

## 🏗️ Architecture

### Project Structure

```
src/app/
├── features/
│   ├── customer/                    # Customer profile feature
│   │   ├── customer-info.component.ts
│   │   ├── customer-info.component.html
│   │   └── customer-info.component.scss
│   │
│   └── portfolio/                   # Portfolio feature module
│       ├── components/
│       │   ├── filters/            # Filter component
│       │   ├── payment-summary/    # Payment summary card
│       │   ├── summary/            # Portfolio summary cards
│       │   └── table/
│       │       ├── portfolio-table.component.*    # Simple table
│       │       └── property-table.component.*     # Advanced table with sorting
│       │
│       ├── models/                 # TypeScript interfaces
│       │   ├── property.model.ts
│       │   ├── rent-payment.model.ts
│       │   ├── filters.model.ts
│       │   └── portfolio-view.model.ts
│       │
│       ├── services/               # Business logic
│       │   ├── portfolio.service.ts
│       │   └── mock-data.ts        # Centralized mock data
│       │
│       ├── portfolio.store.ts      # State management
│       ├── portfolio.routes.ts     # Feature routes
│       ├── portfolio-dashboard.component.*
│       ├── portfolio-overview.component.*
│       └── portfolio-detail.component.*
│
├── shared/
│   └── snack-bar/                  # Custom notification system
│       ├── snack-bar-type.enum.ts
│       ├── snack-bar.interface.ts
│       ├── snack-bar.component.*
│       └── snack-bar.service.ts
│
├── not-found/                      # 404 error page
│   └── not-found.component.*
│
├── app.component.*                 # Root component
├── app.routes.ts                   # Application routes
└── app.config.ts                   # App configuration
```

### State Management

**PortfolioStore** - Centralized state using Angular Signals:
- Properties list
- Payments list
- Active filters
- Statistics (occupancy rate, total income)
- Loading/error states

### Routing Structure

```
/ → /portfolio (redirect)
/profile → Customer profile page
/portfolio → Portfolio dashboard
/portfolio/properties → Properties list with filters
/portfolio/:id → Property detail page
/** → 404 Not Found page
```

## 📊 Mock Data Structure

### Properties

Located in: `src/app/features/portfolio/services/mock-data.ts`

```typescript
Property {
  id: string;                    // Unique identifier
  address: string;               // Street address
  city: string;                  // City name
  postalCode: string;            // Postal code
  type: 'flat' | 'house' | 'studio';  // Property type
  status: 'available' | 'rented' | 'reserved';  // Current status
  monthlyRent: number;           // Rent amount
  currency: 'NOK';               // Currency code
  tenant: Tenant | null;         // Current tenant or null
  leaseExpires: Date | null;     // Lease expiration date
  images: string[];              // Array of image URLs
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Test Properties

Special test cases included in mock data:

| Property | Purpose | Expected Behavior |
|----------|---------|-------------------|
| `id: 'prop-1'` to `'prop-5'` | Normal properties | Display normally |
| `id: 'prop-6'`<br/>`images: []` | No images test | Shows "No images available" message |
| `id: ''` | Empty ID test | Shows "Invalid property ID" → Redirect |
| `id: 'null'` | Null string test | Shows "Invalid property ID" → Redirect |
| `id: 'Server_error'` | Server error test | Shows "Server error" → Redirect |

### Rent Payments

```typescript
RentPayment {
  id: string;                    // Payment ID
  propertyId: string;            // Reference to property
  propertyAddress: string;       // Property address
  tenantId: string;              // Tenant ID
  tenantName: string;            // Tenant name
  amount: number;                // Payment amount
  currency: 'NOK';               // Currency
  dueDate: Date;                 // Due date
  paidDate: Date | null;         // Payment date or null
  status: 'paid' | 'pending' | 'overdue';  // Payment status
  month: string;                 // Month in YYYY-MM format
}
```

## 🧪 Testing Error Scenarios

### 1. Empty Images Test

**Navigate to:** Property "Damsgårdsveien 61 - No Images"

**Expected Result:**
- Property displays normally
- Shows "No images available" message instead of carousel
- Clean, professional appearance

### 2. Invalid Property ID (Empty)

**Property:** `id: ''` - "Damsgårdsveien 61 - ID error"

**How to Trigger:**
```typescript
// Navigate to empty ID
router.navigate(['/portfolio', '']);
```

**Expected Result:**
1. Validation catches empty ID immediately
2. SnackBar warning: "Property with ID 'Invalid property ID' not found"
3. Auto-redirect to `/portfolio/properties`
4. No loading spinner shown

### 3. Invalid Property ID (Null String)

**Property:** `id: 'null'` - "Damsgårdsveien 22 - ID error"

**How to Trigger:**
```typescript
// Navigate to property with id 'null'
router.navigate(['/portfolio', 'null']);
```

**Expected Result:**
1. Validation detects 'null' string
2. SnackBar warning: "Property with ID 'Invalid property ID' not found"
3. Auto-redirect to `/portfolio/properties`

### 4. Server Error Simulation

**Property:** `id: 'Server_error'` - "Damsgårdsveien 33 - Missing data"

**How to Trigger:**
```typescript
// Navigate to property that triggers server error
router.navigate(['/portfolio', 'Server_error']);
```

**Service Logic:**
```typescript
getPropertyById(id: string): Observable<Property | undefined> {
  if (id === 'Server_error') {
    return of(null).pipe(
      delay(800),
      switchMap(() => {
        throw new Error('Server error: Failed to fetch property data');
      })
    );
  }
  // ... normal logic
}
```

**Expected Result:**
1. Shows loading spinner for 800ms
2. Service throws error
3. SnackBar error: "Unable to load property: Server error: Failed to fetch property data"
4. Auto-redirect to `/portfolio/properties`

### 5. Property Not Found

**How to Trigger:**
```typescript
// Navigate to non-existent property
router.navigate(['/portfolio', 'non-existent-id']);
```

**Expected Result:**
1. Service returns `undefined`
2. SnackBar warning: "Property with ID 'non-existent-id' not found"
3. Auto-redirect to `/portfolio/properties`

### 6. 404 Page Test

**How to Trigger:**
- Navigate to `/invalid-route`
- Navigate to `/random-page`
- Navigate to `/test`

**Expected Result:**
- Full 404 error page displayed
- Shows animated "404" number
- Helpful links to valid pages
- "Go Home" and "Go Back" buttons

## 🎨 Notification System

### SnackBar Types

```typescript
// Success notification (green)
snackBarService.success('Property saved successfully');

// Error notification (red)
snackBarService.error('Failed to load data');

// Warning notification (orange)
snackBarService.warning('Property not found');

// Info notification (blue)
snackBarService.info('Edit functionality coming soon');

// Neutral notification (grey)
snackBarService.neutral('Filters reset');
```

### Features
- Auto-dismiss with progress bar
- Pin/unpin to prevent auto-close
- Manual close button
- Top-right positioning
- Configurable duration
- Queue management (one at a time)

## 🎯 Key Business Logic

### Property Status Calculation

```typescript
PropertyWithStatus = Property + {
  needsAttention: boolean;        // Requires owner action
  attentionReason?: string;       // Why it needs attention
  hasOverduePayment: boolean;     // Rent is overdue
  daysUntilLeaseExpiry: number | null;  // Days until lease ends
}
```

**Attention Criteria:**
- Overdue rent payment
- Lease expiring within 60 days
- Lease already expired

### Statistics Calculation

```typescript
{
  totalProperties: number;        // Total property count
  availableProperties: number;    // Properties available for rent
  rentedProperties: number;       // Currently rented
  reservedProperties: number;     // Reserved for tenants
  occupancyRate: number;          // Percentage (0-100)
  totalMonthlyIncome: number;     // Sum of all rents
  needsAttentionCount: number;    // Properties requiring action
  overduePaymentCount: number;    // Properties with overdue rent
  expiringSoonCount: number;      // Leases expiring within 60 days
}
```

### Payment Summary

```typescript
{
  totalExpected: number;          // Total rent expected
  totalReceived: number;          // Total rent received
  totalPending: number;           // Rent awaiting payment
  totalOverdue: number;           // Overdue rent amount
  collectionRate: number;         // Percentage collected (0-100)
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Angular CLI 19

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd hybel/hybel-app

# Install dependencies
npm install

# Start development server
npm start

# Open browser
# Navigate to http://localhost:4200
```

### Development

```bash
# Run development server
npm start

# Build for production
npm run build

# Run tests (when implemented)
npm test

# Lint code
npm run lint
```

## 🎨 Theme & Design

### Color Palette
- **Primary Green:** #53651f
- **Success:** #4caf50 (green)
- **Error:** #f44336 (red)
- **Warning:** #ff9800 (orange)
- **Info:** #2196f3 (blue)
- **Neutral:** #424242 (grey)

### Typography
- Font: Roboto (Material Design)
- Locale: Norwegian (nb-NO)
- Currency: NOK (Norwegian Krone)
- Date Format: dd.MM.yyyy

## 📝 Code Quality

### Standards
- ✅ TypeScript strict mode
- ✅ OnPush change detection
- ✅ Standalone components
- ✅ Reactive patterns (Signals + RxJS)
- ✅ Separation of concerns (HTML/SCSS/TS)
- ✅ Centralized mock data
- ✅ No unused code or imports
- ✅ No console.log statements
- ✅ Proper error handling
- ✅ No expensive operations in templates
- ✅ Computed signals for derived data

### Performance Best Practices

#### ❌ **Avoid: Filtering/Mapping in Templates**

```html
<!-- ❌ BAD: Creates new array on every change detection cycle -->
<div *ngIf="items.filter(i => i.status === 'active').length > 0">
  @for (item of items.filter(i => i.status === 'active'); track item.id) {
    <div>{{ item.name }}</div>
  }
</div>
```

**Why it's bad:**
- `filter()` runs on **every** change detection cycle (potentially hundreds of times)
- Creates new array instances repeatedly
- Causes performance degradation with large datasets
- Violates Angular's "pure pipes only in templates" principle

#### ✅ **Correct: Use Computed Signals or Component Properties**

```typescript
// ✅ GOOD: Computed signal (recalculates only when dependencies change)
protected readonly activeItems = computed(() =>
  this.items().filter(i => i.status === 'active')
);

protected readonly hasActiveItems = computed(() =>
  this.activeItems().length > 0
);
```

```html
<!-- ✅ GOOD: Clean template, no logic -->
@if (hasActiveItems()) {
  @for (item of activeItems(); track item.id) {
    <div>{{ item.name }}</div>
  }
}
```

**Benefits:**
- Memoized: only recalculates when `items()` changes
- Cached: returns same array reference until data changes
- Type-safe and testable
- Works seamlessly with OnPush change detection

#### Other Template Antipatterns to Avoid

```html
<!-- ❌ BAD: Function calls in templates -->
<div>{{ calculateTotal(items) }}</div>

<!-- ✅ GOOD: Computed signal -->
protected readonly total = computed(() => this.calculateTotal(this.items()));
<div>{{ total() }}</div>

<!-- ❌ BAD: Chained operations -->
<div>{{ items.filter(...).map(...).sort(...).slice(0, 5) }}</div>

<!-- ✅ GOOD: Single computed signal -->
protected readonly topFiveItems = computed(() =>
  this.items()
    .filter(...)
    .map(...)
    .sort(...)
    .slice(0, 5)
);

<!-- ❌ BAD: Complex conditionals -->
@if (user && user.role === 'admin' && user.permissions.includes('edit')) {

<!-- ✅ GOOD: Computed property -->
protected readonly canEdit = computed(() => {
  const user = this.user();
  return user?.role === 'admin' &&
         user?.permissions.includes('edit');
});
```

### File Naming
- Components: `*.component.ts`
- Templates: `*.component.html`
- Styles: `*.component.scss`
- Services: `*.service.ts`
- Models: `*.model.ts`
- Enums: `*.enum.ts`

## 🐛 Known Limitations

1. **Mock Data Only** - No real backend API integration yet
2. **No Authentication** - User authentication not implemented
3. **No Data Persistence** - Changes lost on page refresh
4. **Limited Edit Functionality** - Property editing shows placeholder
5. **No Tests** - Unit and E2E tests not yet implemented

## 📦 Dependencies

### **Core Framework**
- **Angular Core**: ^19.2.18
- **Angular Router**: ^19.2.18
- **Angular Forms**: ^19.2.18
- **Angular Animations**: ^19.2.18
- **Angular Platform Browser**: ^19.2.18

### **UI Components**
- **Angular Material**: ^19.2.19
- **Angular CDK**: ^19.2.19

### **Reactive Programming**
- **RxJS**: ~7.8.0
- **Zone.js**: ~0.15.1

### **Development Tools**
- **Angular CLI**: ^19.2.20
- **TypeScript**: ~5.8.3
- **Angular DevKit**: ^19.2.20

### **Testing Framework**
- **Jasmine Core**: ~5.1.0
- **Karma**: ~6.4.0
- **@types/jasmine**: ~5.1.0

### **Build & Deployment**
- **esbuild**: (via Angular 19 application builder)
- **Netlify**: Ready for deployment
- **Node.js**: 18+ required

## 🎯 Key Takeaways

### **Modern Angular Stack**
✅ Latest Angular 19 with standalone components
✅ Signal-based reactive state management
✅ OnPush change detection strategy
✅ Material Design 3 components
✅ TypeScript 5.8 with strict mode

### **Architecture Highlights**
✅ Pure functions for business logic (framework-agnostic)
✅ Centralized state with PortfolioStore
✅ Separation of concerns (components, services, utilities)
✅ Lazy-loaded feature modules
✅ Computed signals for derived state

### **Performance Optimizations**
✅ OnPush change detection reduces checks
✅ TrackBy functions prevent unnecessary re-renders
✅ Code splitting with lazy routes
✅ Gzip compression: 1.1 MB → 207 KB
✅ Efficient bundle structure (639 KB initial, 382 KB lazy)

### **Best Practices Implemented**
✅ No template filtering/mapping (uses computed signals)
✅ Immutable state updates
✅ Custom notification system (SnackBar)
✅ Error handling with graceful fallbacks
✅ Accessibility considerations (keyboard navigation, ARIA)

### **Production Ready Features**
✅ Netlify deployment configuration
✅ Security headers (CSP, XSS protection)
✅ Cache optimization (1-year for assets)
✅ SPA routing configuration
✅ Environment-based builds

## 🔮 Future Enhancements

- [ ] Backend API integration (HttpClient ready)
- [ ] User authentication & authorization
- [ ] Property CRUD operations
- [ ] Tenant management system
- [ ] Payment processing integration
- [ ] Document management
- [ ] Email notifications
- [ ] Reports & analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] PWA capabilities (offline support)
- [ ] Unit & E2E tests (framework ready)
- [ ] State persistence (localStorage)
- [ ] Virtual scrolling for large datasets

## 📄 License

This project is for demonstration purposes.

## 👥 Contributors

Built with Angular 19 and Material Design 3.

---

**Version:** 1.0.0
**Last Updated:** February 2026
