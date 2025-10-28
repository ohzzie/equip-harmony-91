import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { WorkOrderStatus } from '@/types';
import { 
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WorkOrders() {
  const [searchTerm, setSearchTerm] = useState('');

  const filterByStatus = (status?: WorkOrderStatus) => {
    return MOCK_WORK_ORDERS.filter(wo => 
      !status || wo.status === status
    ).filter(wo => 
      searchTerm === '' || 
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const WorkOrderList = ({ workOrders }: { workOrders: typeof MOCK_WORK_ORDERS }) => (
    <div className="space-y-3">
      {workOrders.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No work orders found
        </div>
      ) : (
        workOrders.map(wo => (
          <Link key={wo.id} to={`/work-orders/${wo.id}`}>
            <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{wo.id}</span>
                  <StatusBadge status={wo.status} />
                  <StatusBadge status={wo.priority} />
                  {wo.safetyTags && wo.safetyTags.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      Safety
                    </span>
                  )}
                </div>
                <p className="font-medium">{wo.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{wo.equipmentName}</span>
                  <span>•</span>
                  <span>{wo.site} - {wo.area}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </Link>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">Manage and track maintenance requests</p>
        </div>
        <Link to="/work-orders/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Work Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({MOCK_WORK_ORDERS.length})</TabsTrigger>
              <TabsTrigger value="open">Open ({filterByStatus('open').length})</TabsTrigger>
              <TabsTrigger value="assigned">Assigned ({filterByStatus('assigned').length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({filterByStatus('in_progress').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filterByStatus('completed').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <WorkOrderList workOrders={filterByStatus()} />
            </TabsContent>
            <TabsContent value="open">
              <WorkOrderList workOrders={filterByStatus('open')} />
            </TabsContent>
            <TabsContent value="assigned">
              <WorkOrderList workOrders={filterByStatus('assigned')} />
            </TabsContent>
            <TabsContent value="in_progress">
              <WorkOrderList workOrders={filterByStatus('in_progress')} />
            </TabsContent>
            <TabsContent value="completed">
              <WorkOrderList workOrders={filterByStatus('completed')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
