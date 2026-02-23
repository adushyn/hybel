import { Property } from '../models/property.model';
import { RentPayment } from '../models/rent-payment.model';

/**
 * Centralized Mock Data for Portfolio Feature
 * All mock/test data should be defined here
 */

/**
 * Mock property images using Picsum Photos placeholder service
 */
export const MOCK_IMAGES = [
  'https://picsum.photos/seed/apartment1/800/600',
  'https://picsum.photos/seed/apartment2/800/600',
  'https://picsum.photos/seed/apartment3/800/600',
  'https://picsum.photos/seed/apartment4/800/600',
  'https://picsum.photos/seed/apartment5/800/600',
  'https://picsum.photos/seed/apartment6/800/600',
  'https://picsum.photos/seed/apartment7/800/600'
];

/**
 * Mock Properties - Based on Hybel case data
 */
export const MOCK_PROPERTIES: Property[] = [
  {
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
      name: 'Anna M.',
      email: 'anna.m@example.com',
      phone: '+47 123 45 678'
    },
    leaseExpires: new Date('2026-08-31'),
    images: MOCK_IMAGES,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'prop-2',
    address: 'Grünerløkka 45',
    city: 'Oslo',
    postalCode: '0552',
    type: 'flat',
    status: 'rented',
    monthlyRent: 14800,
    currency: 'NOK',
    tenant: {
      id: 'tenant-2',
      name: 'Erik S.',
      email: 'erik.s@example.com',
      phone: '+47 234 56 789'
    },
    leaseExpires: new Date('2025-04-15'),
    images: MOCK_IMAGES,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'prop-3',
    address: 'Nordnes gate 8',
    city: 'Bergen',
    postalCode: '5005',
    type: 'flat',
    status: 'available',
    monthlyRent: 10200,
    currency: 'NOK',
    tenant: null,
    leaseExpires: null,
    images: MOCK_IMAGES,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'prop-4',
    address: 'Solsiden 22',
    city: 'Trondheim',
    postalCode: '7014',
    type: 'house',
    status: 'reserved',
    monthlyRent: 16500,
    currency: 'NOK',
    tenant: {
      id: 'tenant-pending',
      name: 'Pending',
      email: 'pending@example.com'
    },
    leaseExpires: new Date('2026-01-01'),
    images: MOCK_IMAGES,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'prop-5',
    address: 'Frognerveien 33',
    city: 'Oslo',
    postalCode: '0263',
    type: 'flat',
    status: 'rented',
    monthlyRent: 18200,
    currency: 'NOK',
    tenant: {
      id: 'tenant-3',
      name: 'Sofie K.',
      email: 'sofie.k@example.com',
      phone: '+47 345 67 890'
    },
    leaseExpires: new Date('2025-11-30'),
    images: MOCK_IMAGES,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'prop-6',
    address: 'Damsgårdsveien 61',
    city: 'Bergen',
    postalCode: '5058',
    type: 'studio',
    status: 'rented',
    monthlyRent: 8900,
    currency: 'NOK',
    tenant: {
      id: 'tenant-4',
      name: 'Mads L.',
      email: 'mads.l@example.com',
      phone: '+47 456 78 901'
    },
    leaseExpires: new Date('2025-09-01'),
    images: MOCK_IMAGES,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'prop-7',
    address: 'Error - No Images',
    city: 'Bergen',
    postalCode: '5058',
    type: 'studio',
    status: 'rented',
    monthlyRent: 8900,
    currency: 'NOK',
    tenant: {
      id: 'tenant-4',
      name: 'Mads L.',
      email: 'mads.l@example.com',
      phone: '+47 456 78 901'
    },
    leaseExpires: new Date('2025-09-01'),
    images: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'null',
    address: 'Error - No ID',
    city: 'Bergen',
    postalCode: '5058',
    type: 'studio',
    status: 'rented',
    monthlyRent: 8900,
    currency: 'NOK',
    tenant: {
      id: 'tenant-4',
      name: 'Mads L.',
      email: 'mads.l@example.com',
      phone: '+47 456 78 901'
    },
    leaseExpires: new Date('2025-09-01'),
    images: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: 'Server_error',
    address: 'Server_error',
    city: 'Bergen',
    postalCode: '5058',
    type: 'studio',
    status: 'rented',
    monthlyRent: 8900,
    currency: 'NOK',
    tenant: {
      id: 'tenant-4',
      name: 'Mads L.',
      email: 'mads.l@example.com',
      phone: '+47 456 78 901'
    },
    leaseExpires: new Date('2025-09-01'),
    images: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-02-01')
  }
];

/**
 * Mock Rent Payments - Current Month (February 2025)
 */
export const MOCK_PAYMENTS: RentPayment[] = [
  {
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
  },
  {
    id: 'pay-2',
    propertyId: 'prop-2',
    propertyAddress: 'Grünerløkka 45',
    tenantId: 'tenant-2',
    tenantName: 'Erik S.',
    amount: 14800,
    currency: 'NOK',
    dueDate: new Date('2025-02-01'),
    paidDate: null,
    status: 'overdue',
    month: '2025-02'
  },
  {
    id: 'pay-3',
    propertyId: 'prop-5',
    propertyAddress: 'Frognerveien 33',
    tenantId: 'tenant-3',
    tenantName: 'Sofie K.',
    amount: 18200,
    currency: 'NOK',
    dueDate: new Date('2025-02-01'),
    paidDate: new Date('2025-02-01'),
    status: 'paid',
    month: '2025-02'
  }
];
