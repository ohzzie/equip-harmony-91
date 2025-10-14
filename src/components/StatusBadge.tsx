import { Badge } from '@/components/ui/badge';
import { WorkOrderStatus, Priority, ServiceabilityStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: WorkOrderStatus | Priority | ServiceabilityStatus;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: string; className: string }> = {
  // Work Order Status
  open: { label: 'Open', variant: 'secondary', className: 'bg-status-open text-primary' },
  assigned: { label: 'Assigned', variant: 'secondary', className: 'bg-status-assigned text-warning-foreground' },
  in_progress: { label: 'In Progress', variant: 'secondary', className: 'bg-status-progress text-accent-foreground' },
  completed: { label: 'Completed', variant: 'secondary', className: 'bg-status-completed text-success-foreground' },
  verified: { label: 'Verified', variant: 'secondary', className: 'bg-status-verified text-success-foreground' },
  closed: { label: 'Closed', variant: 'secondary', className: 'bg-muted text-muted-foreground' },
  
  // Priority
  critical: { label: 'Critical', variant: 'destructive', className: 'bg-destructive text-destructive-foreground' },
  high: { label: 'High', variant: 'destructive', className: 'bg-warning text-warning-foreground' },
  medium: { label: 'Medium', variant: 'secondary', className: 'bg-primary/10 text-primary' },
  low: { label: 'Low', variant: 'outline', className: 'border-muted-foreground/30 text-muted-foreground' },
  
  // Serviceability
  serviceable: { label: 'Serviceable', variant: 'secondary', className: 'bg-success/10 text-success' },
  unserviceable: { label: 'Unserviceable', variant: 'destructive', className: 'bg-destructive/10 text-destructive' },
  pending: { label: 'Pending', variant: 'secondary', className: 'bg-warning/10 text-warning-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary', className: '' };
  
  return (
    <Badge variant={config.variant as any} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
