import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Clock, 
  Play, 
  Pause, 
  Camera, 
  Package, 
  ClipboardList,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function TechnicianHome() {
  const myJobs = MOCK_WORK_ORDERS.filter(wo => 
    wo.status === 'in_progress' || wo.status === 'assigned'
  ).sort((a, b) => new Date(b.stateEnteredAt).getTime() - new Date(a.stateEnteredAt).getTime())
  .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
        <p className="text-muted-foreground">Field execution and work order management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active work orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Timer running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Completed jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Queue */}
      <Card>
        <CardHeader>
          <CardTitle>My Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myJobs.map(job => (
              <Link key={job.id} to={`/work-orders/${job.id}`}>
                <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{job.id}</span>
                      <StatusBadge status={job.status} />
                      <StatusBadge status={job.priority} />
                    </div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.equipmentName}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:shadow-elevated">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Start Timer</h3>
            <p className="text-sm text-muted-foreground">Begin work on a job</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-elevated">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Package className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-medium">Issue Parts</h3>
            <p className="text-sm text-muted-foreground">Scan and issue materials</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-elevated">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Camera className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-medium">Add Photo</h3>
            <p className="text-sm text-muted-foreground">Capture evidence</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
