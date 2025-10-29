import { PartRequest } from '@/types/partRequest';

export const MOCK_PART_REQUESTS: PartRequest[] = [
  {
    id: 'PR-001',
    workOrderId: 'WO-2025-00145',
    workOrderTitle: 'Belt Loader - Hydraulic System Repair',
    requestedBy: 'John Smith',
    requestedById: 'user-001',
    requestedAt: '2025-01-15T10:30:00Z',
    parts: [
      {
        partId: 'HYD-PUMP-001',
        partName: 'Hydraulic Pump Assembly',
        quantity: 1,
        reason: 'Main pump failed, requires replacement'
      },
      {
        partId: 'HYD-OIL-5L',
        partName: 'Hydraulic Oil (5L)',
        quantity: 2,
        reason: 'System refill after pump replacement'
      }
    ],
    status: 'pending',
  },
  {
    id: 'PR-002',
    workOrderId: 'WO-2025-00143',
    workOrderTitle: 'GPU - Engine Maintenance',
    requestedBy: 'John Smith',
    requestedById: 'user-001',
    requestedAt: '2025-01-14T14:20:00Z',
    parts: [
      {
        partId: 'ENG-FILTER-001',
        partName: 'Engine Oil Filter',
        quantity: 2,
        reason: 'Scheduled maintenance'
      },
      {
        partId: 'ENG-OIL-20L',
        partName: 'Engine Oil (20L)',
        quantity: 1,
        reason: 'Oil change'
      }
    ],
    status: 'approved',
    approvedBy: 'David Wilson',
    approvedAt: '2025-01-14T15:00:00Z',
  },
];
