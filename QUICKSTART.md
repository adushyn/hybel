# Portfolio Feature - Quick Start Guide

## 🚀 Running the Application

```bash
# Start development server
npm start

# Or
ng serve

# Open browser to http://localhost:4200
```

## 📁 Feature Structure Overview

```
src/app/features/portfolio/
├── 📂 components/              # Presentational Components (Dumb)
│   ├── summary/
│   ├── filters/
│   └── table/
├── 📂 models/                  # TypeScript Interfaces
├── 📂 services/                # Data Services
├── 📂 utils/                   # Helper Functions
├── 📄 portfolio-overview.component.ts   # Container (Smart)
├── 📄 portfolio-detail.component.ts     # Detail View
├── 📄 portfolio.store.ts                # State Management
├── 📄 portfolio.vm.ts                   # ViewModel Builder
└── 📄 portfolio.routes.ts               # Routes
```

## 🎯 Key Features

### 1. Smart/Presentational Pattern
- **Smart Component**: `PortfolioOverviewComponent`
  - Manages state
  - Handles business logic
  - Orchestrates presentational components

- **Dumb Components**: All in `components/` folder
  - Only receive data via `@Input()`
  - Only emit events via `@Output()`
  - No services injected
  - Pure UI logic

### 2. RxJS Store (No NgRx)
```typescript
// portfolio.store.ts
- BehaviorSubject for state
- Observable selectors
- Action methods
- Immutable updates
```

### 3. ViewModel Pattern
```typescript
// Single observable in template
@if (vm$ | async; as vm) {
  // All data available in vm
  <app-portfolio-summary [summary]="vm.summary">
  <app-portfolio-filters [filters]="vm.filters">
  <app-portfolio-table [items]="vm.items">
}
```

### 4. Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush  // All components
})
```

### 5. No Template Logic
```typescript
// ❌ DON'T
<div *ngIf="items.filter(i => i.status === 'active').length > 0">

// ✅ DO
<div *ngIf="vm.hasActiveItems">
```

## 📊 Data Flow

```
User Action
    ↓
Presentational Component (@Output)
    ↓
Container Component (handler)
    ↓
Store (action)
    ↓
State Update
    ↓
Observable Selector
    ↓
ViewModel (combineLatest)
    ↓
Template (async pipe)
    ↓
UI Update
```

## 🔄 Making Changes

### Add a New Filter

1. **Update Model** (`models/portfolio-item.model.ts`)
```typescript
export interface PortfolioFilters {
  // ... existing filters
  newFilter: string;
}
```

2. **Update Store** (`portfolio.store.ts`)
```typescript
private applyFilters(items: PortfolioItem[], filters: PortfolioFilters) {
  // Add new filter logic
}
```

3. **Update Filters Component** (`components/filters/`)
```typescript
// Add UI control
<mat-form-field>
  <mat-select [value]="filters.newFilter"
              (selectionChange)="onNewFilterChange($event.value)">
  </mat-select>
</mat-form-field>

// Add event handler
onNewFilterChange(value: string): void {
  this.filtersChange.emit({ newFilter: value });
}
```

### Add a New Presentational Component

1. **Create Component** in `components/new-component/`
```typescript
@Component({
  selector: 'app-portfolio-new',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
  styles: [`...`]
})
export class PortfolioNewComponent {
  @Input({ required: true }) data!: SomeType;
  @Output() action = new EventEmitter<string>();
}
```

2. **Add to Container** (`portfolio-overview.component.ts`)
```typescript
// Import component
import { PortfolioNewComponent } from './components/new-component/...';

// Add to imports array
imports: [..., PortfolioNewComponent]

// Add to template
<app-portfolio-new
  [data]="vm.someData"
  (action)="handleAction($event)">
</app-portfolio-new>

// Add event handler
handleAction(value: string): void {
  // Business logic here
}
```

## 🧪 Testing

### Test Presentational Component
```typescript
it('should display summary data', () => {
  const summary: PortfolioSummary = {
    totalProjects: 5,
    activeProjects: 3,
    completedProjects: 2,
    featuredProjects: 1
  };

  component.summary = summary;
  fixture.detectChanges();

  expect(compiled.querySelector('.total')).toHaveText('5');
});
```

### Test Container Component
```typescript
it('should load data on init', () => {
  const spy = spyOn(service, 'loadPortfolioItems')
    .and.returnValue(of(mockItems));

  component.ngOnInit();

  expect(spy).toHaveBeenCalled();
});
```

### Test Store
```typescript
it('should filter by category', () => {
  store.setItems(mockItems);
  store.updateFilters({ category: 'Web Development' });

  store.filteredItems$.subscribe(items => {
    expect(items.length).toBe(2);
    expect(items.every(i => i.category === 'Web Development')).toBe(true);
  });
});
```

## 📚 Documentation

- **Architecture Overview**: See `ARCHITECTURE.md`
- **Feature Documentation**: See `src/app/features/portfolio/README.md`
- **Project Setup**: See `PROJECT_SETUP.md`

## ✅ Best Practices Checklist

When adding new code, ensure:

- [ ] Component uses `ChangeDetectionStrategy.OnPush`
- [ ] No business logic in template
- [ ] Use async pipe (no manual subscriptions)
- [ ] Presentational components are pure (no services)
- [ ] Inputs are typed with `@Input({ required: true })`
- [ ] Outputs are typed `EventEmitter<Type>`
- [ ] State updates are immutable
- [ ] No logic in template (move to TS)

## 🎓 Learning Resources

### Key Concepts to Understand

1. **Smart vs Dumb Components**
   - Smart: State, logic, services
   - Dumb: Props in, events out

2. **OnPush Change Detection**
   - Only checks on input reference change
   - Or async pipe emission
   - Or event from component

3. **RxJS Observables**
   - BehaviorSubject for state
   - Operators for transformations
   - CombineLatest for ViewModel

4. **Immutability**
   - Spread operator `{...obj}`
   - Array methods that return new arrays
   - Never mutate state directly

## 🚦 Common Patterns

### Handling Loading State
```typescript
// In template
@if (vm.loading) {
  <mat-spinner></mat-spinner>
} @else {
  <!-- content -->
}
```

### Handling Empty State
```typescript
@if (!vm.hasItems) {
  <div class="empty-state">No items found</div>
} @else {
  <!-- items -->
}
```

### Form Input Handling
```typescript
// Presentational component
onInputChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.valueChange.emit(value);  // Emit to parent
}
```

## 💡 Tips

1. **Keep presentational components small and focused**
2. **Move all logic to TypeScript, not templates**
3. **Use ViewModel pattern for complex state**
4. **Test presentational components without mocks**
5. **Use OnPush everywhere for performance**
6. **Let async pipe manage subscriptions**
7. **Keep store methods simple and focused**

## 🔍 Debugging

### Check Store State
```typescript
this.store['state$'].subscribe(state => {
  console.log('Current state:', state);
});
```

### Check ViewModel
```typescript
this.vm$.subscribe(vm => {
  console.log('ViewModel:', vm);
});
```

### Verify Change Detection
Add `console.log` in component to verify OnPush is working:
```typescript
ngOnChanges() {
  console.log('Component changed!');
}
```

---

**Ready to build! 🚀**

For detailed architecture information, see `ARCHITECTURE.md`
