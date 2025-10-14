export type WorkOrderStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'verified'
  | 'closed';

export type WorkOrderType = 'corrective' | 'preventive' | 'inspection' | 'calibration';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type ServiceabilityStatus = 'serviceable' | 'unserviceable' | 'pending';

export interface WorkOrder {
  id: string;
  equipmentId: string;
  equipmentName: string;
  site: string;
  area: string;
  line?: string;
  type: WorkOrderType;
  priority: Priority;
  title: string;
  description: string;
  requester: string;
  requesterId: string;
  assignees: string[];
  status: WorkOrderStatus;
  reportedAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  closedAt?: string;
  dueBy?: string;
  failureCode?: string;
  causeCode?: string;
  remedyCode?: string;
  safetyTags?: string[];
  laborHours?: number;
  partsCost?: number;
  totalCost?: number;
  attachments: string[];
  photos: string[];
  notes: string[];
  evidenceMinMet: boolean;
  stateEnteredAt: string;
  verificationStatus?: ServiceabilityStatus;
  rejectionReason?: string;
}

export interface Equipment {
  id: string;
  name: string;
  site: string;
  area: string;
  line?: string;
  asset: string;
  component?: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  status: ServiceabilityStatus;
  specs?: Record<string, string>;
  pmCadence?: string;
  lastPM?: string;
  nextPM?: string;
  mttr?: number;
  mttb?: number;
  historyCount: number;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  uom: string;
  onHand: number;
  reserved: number;
  onOrder: number;
  min: number;
  max: number;
  unitCost: number;
  substitutes?: string[];
}

export interface PartIssue {
  id: string;
  workOrderId: string;
  partId: string;
  partName: string;
  quantity: number;
  cost: number;
  issuedAt: string;
  issuedBy: string;
}

export interface TimerEntry {
  id: string;
  workOrderId: string;
  userId: string;
  startedAt: string;
  stoppedAt?: string;
  duration?: number;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}
