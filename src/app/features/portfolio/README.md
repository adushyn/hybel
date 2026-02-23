# Portfolio Feature - Architecture Documentation

## Overview

This is a self-contained portfolio feature built with Angular 17 standalone components following the **Smart/Presentational Component Pattern** with a lightweight RxJS-based state management solution.

## Architecture Principles

### ✅ Smart + Presentational Pattern
- **Container (Smart) Components**: Handle business logic, state management, and side effects
- **Presentational (Dumb) Components**: Pure UI components that receive data via `@Input()` and emit events via `@Output()`

### ✅ OnPush Change Detection
- All components use `ChangeDetectionStrategy.OnPush` for optimal performance
- State changes trigger through observables and immutable data patterns

### ✅ No Business Logic in Templates
- Templates only handle presentation and event binding
- All logic is in component TypeScript classes or services

### ✅ Async Pipe Only
- No direct subscriptions in templates
- All observables consumed via `async` pipe
- Automatic subscription management

## Project Structure

```
portfolio/
├── components/                      # Presentational Components
│   ├── summary/
│   │   └── portfolio-summary.component.ts
│   ├── filters/
│   │   └── portfolio-filters.component.ts
│   └── table/
│       └── portfolio-table.component.ts
├── models/                          # TypeScript Interfaces
│   └── portfolio-item.model.ts
├── services/                        # Data Services
│   └── portfolio.service.ts
├── utils/                           # Utility Functions
│   └── portfolio.utils.ts
├── portfolio-overview.component.ts  # Container Component (Smart)
├── portfolio-detail.component.ts    # Detail View Component
├── portfolio.store.ts               # RxJS BehaviorSubject Store
├── portfolio.vm.ts                  # ViewModel Builder
├── portfolio.routes.ts              # Feature Routes
├── index.ts                         # Public API
└── README.md                        # Documentation
```

## Component Hierarchy

```
PortfolioOverviewComponent (Container - Smart)
├── PortfolioSummaryComponent (Presentational)
├── PortfolioFiltersComponent (Presentational)
└── PortfolioTableComponent (Presentational)
```

## Core Components

### Container Component: `PortfolioOverviewComponent`

**Responsibilities:**
- Orchestrates presentational components
- Manages state via `PortfolioStore`
- Handles business logic
- Builds ViewModel from store observables
- Manages side effects (navigation, notifications)

**Key Features:**
- OnPush change detection
- Single `vm$` observable combining all state
- Event handlers for child component events
- No direct subscriptions in template (uses async pipe)

### Presentational Components

#### 1. `PortfolioSummaryComponent`
- **Input**: `summary: PortfolioSummary`
- **Purpose**: Displays project statistics
- **Features**: Material cards with icons and counts

#### 2. `PortfolioFiltersComponent`
- **Inputs**:
  - `filters: PortfolioFilters`
  - `availableCategories: string[]`
  - `availableTechnologies: string[]`
  - `hasActiveFilters: boolean`
- **Outputs**:
  - `filtersChange: EventEmitter<Partial<PortfolioFilters>>`
  - `resetFilters: EventEmitter<void>`
- **Purpose**: Filter controls
- **Features**: Search, category, status, technology filters

#### 3. `PortfolioTableComponent`
- **Input**: `items: PortfolioItem[]`
- **Output**: `viewDetails: EventEmitter<string>`
- **Purpose**: Display portfolio items in a table
- **Features**: Sortable columns, action buttons, status chips

## State Management

### `PortfolioStore`

A lightweight RxJS BehaviorSubject-based store providing:

**State Structure:**
```typescript
interface PortfolioState {
  items: PortfolioItem[];
  filters: PortfolioFilters;
  loading: boolean;
  error: string | null;
}
```

**Selectors:**
- `items$: Observable<PortfolioItem[]>`
- `filters$: Observable<PortfolioFilters>`
- `loading$: Observable<boolean>`
- `error$: Observable<string | null>`
- `filteredItems$: Observable<PortfolioItem[]>` (derived)

**Actions:**
- `setItems(items: PortfolioItem[]): void`
- `updateFilters(filters: Partial<PortfolioFilters>): void`
- `resetFilters(): void`
- `setLoading(loading: boolean): void`
- `setError(error: string | null): void`

**Features:**
- Immutable state updates
- Reactive selectors
- Client-side filtering logic
- Single source of truth

### ViewModel Pattern

The `PortfolioViewModel` interface combines all data needed by the view:

```typescript
interface PortfolioViewModel {
  items: PortfolioItem[];
  summary: PortfolioSummary;
  filters: PortfolioFilters;
  loading: boolean;
  error: string | null;
  hasItems: boolean;
  hasActiveFilters: boolean;
  availableCategories: string[];
  availableTechnologies: string[];
}
```

**Benefits:**
- Single async pipe in template
- Computed properties included
- Type-safe view bindings
- Clean separation of concerns

## Data Flow

```
User Action
    ↓
Presentational Component (@Output)
    ↓
Container Component (event handler)
    ↓
Store (action method)
    ↓
State Update
    ↓
Observable Selector
    ↓
ViewModel Builder (combineLatest + map)
    ↓
vm$ Observable
    ↓
Template (async pipe)
    ↓
Presentational Components (@Input)
    ↓
UI Update
```

## Design Patterns

### 1. **Container/Presentational Pattern**
- Separation of concerns
- Reusable presentational components
- Testable business logic

### 2. **Observable Data Service Pattern**
- Services return observables
- Components consume via async pipe
- Automatic cleanup

### 3. **Facade Pattern**
- Store provides clean API
- Hides implementation details
- Single point of state management

### 4. **ViewModel Pattern**
- Derived state computed once
- Single observable for template
- Type-safe view bindings

## Best Practices Implemented

### ✅ OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### ✅ Async Pipe Only
```html
@if (vm$ | async; as vm) {
  <app-portfolio-summary [summary]="vm.summary"></app-portfolio-summary>
}
```

### ✅ Immutable State Updates
```typescript
private updateState(partial: Partial<PortfolioState>): void {
  this.state$.next({
    ...this.state$.value,
    ...partial
  });
}
```

### ✅ Typed Inputs/Outputs
```typescript
@Input({ required: true }) summary!: PortfolioSummary;
@Output() filtersChange = new EventEmitter<Partial<PortfolioFilters>>();
```

### ✅ No Business Logic in Templates
```html
<!-- ❌ Bad -->
<div *ngIf="items.filter(i => i.status === 'active').length > 0">

<!-- ✅ Good -->
<div *ngIf="hasActiveItems">
```

## Testing Strategy

### Container Components
- Test state management
- Test event handlers
- Test ViewModel building
- Mock services and store

### Presentational Components
- Test inputs render correctly
- Test outputs emit correctly
- Snapshot testing
- No mocking needed (pure components)

### Store
- Test actions update state correctly
- Test selectors return correct data
- Test filtering logic

### Services
- Test API calls
- Test data transformation
- Mock HTTP client

## Performance Optimizations

1. **OnPush Change Detection** - Reduces change detection cycles
2. **Lazy Loading** - Feature loaded on demand
3. **RxJS Operators** - Efficient data transformations
4. **Async Pipe** - Automatic subscription management
5. **Immutable Data** - Predictable change detection
6. **Pure Presentational Components** - Easy to optimize

## Extending the Feature

### Adding a New Presentational Component

1. Create component in `components/` folder
2. Use OnPush change detection
3. Define typed `@Input()` properties
4. Define typed `@Output()` events
5. Keep component pure (no services)
6. Add to container component template

### Adding New State

1. Update `PortfolioState` interface in store
2. Add selector observable
3. Add action method
4. Update ViewModel interface
5. Update ViewModel builder in container

### Adding New Filters

1. Update `PortfolioFilters` interface
2. Update filtering logic in store
3. Add UI controls in `PortfolioFiltersComponent`
4. Wire up in container component

## Dependencies

- **Angular Core**: ^17.3.0
- **Angular Material**: ^17.3.10
- **RxJS**: ~7.8.0

## Key Takeaways

✅ **Smart/Presentational** separation for maintainability
✅ **OnPush everywhere** for performance
✅ **No business logic in templates** for testability
✅ **Async pipe only** for automatic cleanup
✅ **RxJS BehaviorSubject** for lightweight state management
✅ **ViewModel pattern** for clean data binding
✅ **Type-safe** throughout the application

This architecture provides a scalable, maintainable, and performant foundation for complex Angular applications without the overhead of full state management libraries like NgRx.
