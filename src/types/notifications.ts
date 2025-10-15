export type NotificationType = 'assignment' | 'status_change' | 'overdue' | 'comment' | 'approval' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  workOrderId?: string;
  timestamp: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}
