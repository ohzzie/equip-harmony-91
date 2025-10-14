import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  LayoutGrid, 
  Clock, 
  AlertTriangle,
  Users,
  Calendar,
  PackageX,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

export function PlannerHome() {
  const openWOs = MOCK_WORK_ORDERS.filter(wo => wo.status === 'open' || wo.status === 'assigned');
  const overdueWOs = MOCK_WORK_ORDERS.filter(wo => {
    if (!wo.dueBy) return false;
    return new Date(wo.dueBy) < new Date() && wo.status !== 'closed';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning & Assignment</h1>
          <p className="text-muted-foreground">Triage, schedule, and coordinate work</p>
        </div>
        <Link to="/assignment">
          <Button className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Assignment Board
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Backlog</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueWOs.length}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Today</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Planned work orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Capacity</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Tech utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Aging Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5" />
              Aging Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">&gt;24h unassigned</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">&gt;48h not started</span>
                <span className="font-medium">2</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Review Aging Items
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageX className="h-5 w-5" />
              Parts Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Awaiting parts</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Backorders</span>
                <span className="font-medium">2</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                View Parts Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unassigned Work Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unassigned Work Orders</CardTitle>
            <Link to="/work-orders?status=open">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openWOs.slice(0, 5).map(wo => (
              <Link key={wo.id} to={`/work-orders/${wo.id}`}>
                <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{wo.id}</span>
                      <StatusBadge status={wo.priority} />
                      {wo.safetyTags && wo.safetyTags.length > 0 && (
                        <span className="text-xs text-destructive">⚠️ Safety</span>
                      )}
                    </div>
                    <p className="text-sm font-medium">{wo.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {wo.equipmentName} • {wo.area}
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm">Assign</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
