import { Injectable } from '@angular/core';
import { Observable, of, delay, switchMap } from 'rxjs';
import { Property } from '../models/property.model';
import { RentPayment } from '../models/rent-payment.model';
import { MOCK_PROPERTIES, MOCK_PAYMENTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  /**
   * Load all portfolio data
   * Returns raw data only - calculations are done in the store
   */
  loadPortfolioData(): Observable<{ properties: Property[], payments: RentPayment[] }> {
    return of({
      properties: MOCK_PROPERTIES,
      payments: MOCK_PAYMENTS
    }).pipe(delay(800));
  }

  /**
   * Get properties only
   */
  getProperties(): Observable<Property[]> {
    return of(MOCK_PROPERTIES).pipe(delay(800));
  }

  /**
   * Get payments only
   */
  getPayments(): Observable<RentPayment[]> {
    return of(MOCK_PAYMENTS).pipe(delay(800));
  }

  /**
   * Get single property by ID
   * Simulates server error when id is 'Server error'
   */
  getPropertyById(id: string): Observable<Property | undefined> {
    // Simulate server error for testing
    if (id === 'Server_error') {
      return of(null).pipe(
        delay(800),
        // Throw error after delay to simulate real server behavior
        switchMap(() => {
          throw new Error('Server error: Failed to fetch property data');
        })
      );
    }

    const property = MOCK_PROPERTIES.find(p => p.id === id);
    return of(property).pipe(delay(800));
  }
}
