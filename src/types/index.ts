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
  assignedBy?: string; // Planner/coordinator who assigned
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
  partsUsed?: Array<{ partId: string; partName: string; quantity: number; unitCost: number }>;
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
  
  // SAHCO Fleet Management
  fleetNumber?: string;  // e.g., "93/2"
  equipmentType: string; // GPU, Belt Loader, Tug, etc.
  
  // Location
  site: string; // Airport IATA code (LOS, ABV, PHC)
  area: string;
  line?: string;
  
  // Asset Details
  asset: string;
  component?: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  
  // Purchase Information
  dateOfPurchase?: string;
  purchaseValue?: number;
  purchaseCurrency?: 'NGN' | 'USD' | 'GBP' | 'EUR';
  supplier?: string;
  
  // Status & Condition
  status: ServiceabilityStatus;
  condition?: 'New' | 'Fair' | 'Old';
  
  // Ownership
  assignedDepartment?: string; // Operations / Maintenance / Admin
  currentCustodian?: string; // Responsible person/team
  
  // Maintenance
  specs?: Record<string, string>;
  pmCadence?: string;
  lastPM?: string;
  nextPM?: string;
  
  // Operating Hours
  totalOperatingHours?: number;
  
  // Metrics
  mttr?: number;
  mttb?: number;
  historyCount: number;
  
  // Calculated from Work Orders
  totalRepairs?: number;
  totalMaintenanceCost?: number;
  averageCostPerRepair?: number;
  totalLaborHours?: number;
  
  // Audit
  remarks?: string;
  createdBy?: string;
  createdDate?: string;
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

export interface EquipmentWorkHistory {
  workOrderId: string;
  type: WorkOrderType;
  assignedBy: string; // Planner who assigned
  assignedTo: string[]; // Technicians
  startedAt: string;
  completedAt?: string;
  laborHours?: number;
  partsCost?: number;
  totalCost?: number;
  status: WorkOrderStatus;
}

export interface EquipmentStats {
  equipmentId: string;
  totalWorkOrders: number;
  completedWorkOrders: number;
  totalCost: number;
  averageCostPerRepair: number;
  totalLaborHours: number;
  averageLaborHoursPerRepair: number;
  mostFrequentTechnician?: string;
  mostFrequentAssigner?: string;
  lastMaintenanceDate?: string;
}
