import { Property } from '../models/property.model';

export interface PortfolioMetrics {
  readonly totalProperties: number;
  readonly occupancyRate: number; // percentage (0-100)
  readonly monthlyIncome: number;
}

export function calculateMetrics(
  properties: readonly Property[]
): PortfolioMetrics {
  const totalProperties = properties.length;

  const rentedProperties = properties.filter(p => p.status === 'rented').length;

  const occupancyRate = totalProperties > 0
    ? Math.round((rentedProperties / totalProperties) * 100)
    : 0;

  const monthlyIncome = properties
    .filter(p => p.status === 'rented')
    .reduce((sum, p) => sum + p.monthlyRent, 0);

  return {
    totalProperties,
    occupancyRate,
    monthlyIncome
  };
}

export function calculateAverageRent(
  properties: readonly Property[]
): number {
  const rentedProperties = properties.filter(p => p.status === 'rented');
  if (rentedProperties.length === 0) return 0;

  const totalIncome = rentedProperties.reduce((sum, p) => sum + p.monthlyRent, 0);
  return Math.round(totalIncome / rentedProperties.length);
}

export function countByStatus(
  properties: readonly Property[]
): {
  available: number;
  rented: number;
  reserved: number;
} {
  return {
    available: properties.filter(p => p.status === 'available').length,
    rented: properties.filter(p => p.status === 'rented').length,
    reserved: properties.filter(p => p.status === 'reserved').length
  };
}
