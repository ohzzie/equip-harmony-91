export type PartRequestStatus = 'pending' | 'approved' | 'rejected' | 'issued';

export interface PartRequest {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  requestedBy: string;
  requestedById: string;
  requestedAt: string;
  parts: Array<{
    partId: string;
    partName: string;
    quantity: number;
    reason: string;
  }>;
  status: PartRequestStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  notes?: string;
}
