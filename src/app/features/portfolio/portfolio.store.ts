import { Injectable, computed, signal } from '@angular/core';
import { Property, PropertyWithStatus } from './models/property.model';
import { RentPayment } from './models/rent-payment.model';
import { PropertyFilters } from './models/filters.model';
import { PortfolioStatistics, PaymentSummary } from './models';
import { PortfolioViewModel } from './models/portfolio-view.model';
import * as ViewModel from './portfolio.vm';

/**
 * Portfolio State Interface
 */
interface PortfolioState {
  properties: Property[];
  payments: RentPayment[];
  statistics: PortfolioStatistics | null;
  paymentSummary: PaymentSummary | null;
  filters: PropertyFilters;
  loading: boolean;
  error: string | null;
}

/**
 * Initial Filters
 */
const initialFilters: PropertyFilters = {
  searchTerm: '',
  status: null,
  type: null,
  city: null,
  hasOverduePayment: false,
  leaseExpiringSoon: false,
  needsAttention: false
};

/**
 * Initial State
 */
const initialState: PortfolioState = {
  properties: [],
  payments: [],
  statistics: null,
  paymentSummary: null,
  filters: initialFilters,
  loading: false,
  error: null
};

/**
 * Portfolio Store using Angular Signals
 *
 * Benefits over BehaviorSubject:
 * - Simpler API (no subscribe/unsubscribe)
 * - Better performance (fine-grained reactivity)
 * - Type-safe by default
 * - Automatic change detection with OnPush
 * - Clean separation of concerns
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioStore {
  // Private writable signals for state management
  private readonly state = signal<PortfolioState>(initialState);

  // Public read-only computed signals for specific state slices
  readonly properties = computed(() => this.state().properties);
  readonly payments = computed(() => this.state().payments);
  readonly statistics = computed(() => this.state().statistics);
  readonly paymentSummary = computed(() => this.state().paymentSummary);
  readonly filters = computed(() => this.state().filters);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  // Computed signal: properties with status flags
  readonly propertiesWithStatus = computed(() => {
    const properties = this.properties();
    const payments = this.payments();
    return properties.map(property =>
      ViewModel.addStatusToProperty(property, payments)
    );
  });

  // Computed signal: filtered properties
  readonly filteredProperties = computed(() => {
    const properties = this.propertiesWithStatus();
    const filters = this.filters();
    return ViewModel.applyFilters(properties, filters);
  });

  // Main ViewModel - combines all state using pure functions
  readonly vm = computed<PortfolioViewModel>(() => {
    const properties = this.properties();
    const payments = this.payments();
    const filters = this.filters();
    const loading = this.loading();
    const error = this.error();

    return ViewModel.buildViewModel(properties, payments, filters, loading, error);
  });

  // Actions - Update state immutably
  setProperties(properties: readonly Property[]): void {
    this.updateState({ properties: [...properties] });
  }

  setPayments(payments: readonly RentPayment[]): void {
    this.updateState({ payments: [...payments] });
  }

  setStatistics(statistics: PortfolioStatistics): void {
    this.updateState({ statistics });
  }

  setPaymentSummary(paymentSummary: PaymentSummary): void {
    this.updateState({ paymentSummary });
  }

  updateFilters(filters: Partial<PropertyFilters>): void {
    const currentFilters = this.state().filters;
    this.updateState({
      filters: { ...currentFilters, ...filters }
    });
  }

  resetFilters(): void {
    this.updateState({ filters: initialFilters });
  }

  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  // Business logic: Delegate to pure functions
  calculateStatistics(properties: Property[], payments: RentPayment[]): PortfolioStatistics {
    return ViewModel.calculateStatistics(properties, payments);
  }

  calculatePaymentSummary(payments: RentPayment[]): PaymentSummary {
    return ViewModel.calculatePaymentSummary(payments);
  }

  // Private helper: Update state immutably
  private updateState(partial: Partial<PortfolioState>): void {
    this.state.update(current => ({
      ...current,
      ...partial
    }));
  }
}
