import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, AlertTriangle, MessageSquare, CheckCircle2, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '@/types/notifications';

// Mock notifications - in production, fetch from database
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'assignment',
    title: 'New Work Order Assigned',
    message: 'WO-2025-00145 has been assigned to you',
    workOrderId: 'WO-2025-00145',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high'
  },
  {
    id: 'notif-002',
    type: 'overdue',
    title: 'Work Order Overdue',
    message: 'WO-2025-00138 is past its due date',
    workOrderId: 'WO-2025-00138',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high'
  },
  {
    id: 'notif-003',
    type: 'status_change',
    title: 'Work Order Completed',
    message: 'WO-2025-00142 has been marked as completed',
    workOrderId: 'WO-2025-00142',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    priority: 'medium'
  },
  {
    id: 'notif-004',
    type: 'comment',
    title: 'New Comment',
    message: 'John Smith commented on WO-2025-00140',
    workOrderId: 'WO-2025-00140',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'low'
  },
  {
    id: 'notif-005',
    type: 'approval',
    title: 'Verification Required',
    message: 'WO-2025-00139 needs ops verification',
    workOrderId: 'WO-2025-00139',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'medium'
  },
  {
    id: 'notif-006',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Jan 15, 2:00 AM',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'low'
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'assignment':
      return <CheckCircle2 className="h-4 w-4 text-primary" />;
    case 'status_change':
      return <CheckCheck className="h-4 w-4 text-success" />;
    case 'overdue':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-accent" />;
    case 'approval':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'system':
      return <Settings className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getTimeAgo = (timestamp: string) => {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffInMinutes = Math.floor((now - then) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-1 p-3',
                  !notification.read && 'bg-primary/5'
                )}
                onClick={() => markAsRead(notification.id)}
                asChild
              >
                {notification.workOrderId ? (
                  <Link to={`/work-orders/${notification.workOrderId}`}>
                    <div className="flex w-full items-start gap-3">
                      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'text-sm font-medium leading-tight',
                            !notification.read && 'text-foreground'
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex w-full items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          'text-sm font-medium leading-tight',
                          !notification.read && 'text-foreground'
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="w-full text-center">
            <span className="text-sm font-medium">View all notifications</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
