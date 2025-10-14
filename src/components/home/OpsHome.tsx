import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Plus,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';

export function OpsHome() {
  const myRequests = MOCK_WORK_ORDERS.filter(wo => 
    wo.requesterId === 'user-003'
  ).slice(0, 5);
  
  const toVerify = MOCK_WORK_ORDERS.filter(wo => wo.status === 'completed').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">Create requests and verify completed work</p>
        </div>
        <Link to="/work-orders/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Work Order
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active work orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toVerify.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Serviceable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Rejected/Follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/work-orders/new">
          <Card className="cursor-pointer transition-all hover:shadow-elevated">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Create Work Order</h3>
              <p className="text-sm text-muted-foreground">Report equipment issue</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/verify">
          <Card className="cursor-pointer transition-all hover:shadow-elevated">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-medium">Verify Work</h3>
              <p className="text-sm text-muted-foreground">Review completed jobs</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/equipment">
          <Card className="cursor-pointer transition-all hover:shadow-elevated">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Search className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium">Find Equipment</h3>
              <p className="text-sm text-muted-foreground">Search asset registry</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Verification Queue */}
      {toVerify.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Verification</CardTitle>
              <Link to="/verify">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {toVerify.map(wo => (
                <Link key={wo.id} to={`/verify/${wo.id}`}>
                  <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{wo.id}</span>
                        <StatusBadge status={wo.status} />
                        <StatusBadge status={wo.priority} />
                      </div>
                      <p className="text-sm font-medium">{wo.title}</p>
                      <p className="text-sm text-muted-foreground">{wo.equipmentName}</p>
                    </div>
                    <div className="text-right">
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
