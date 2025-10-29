import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, AlertCircle, ClipboardList, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PART_REQUESTS } from '@/lib/mockPartRequests';
import { MOCK_PARTS } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

export function InventoryManagerHome() {
  const pendingRequests = MOCK_PART_REQUESTS.filter(r => r.status === 'pending');
  const criticalParts = MOCK_PARTS.filter(p => (p.onHand - p.reserved) < p.min);
  const totalSKUs = MOCK_PARTS.length;
  const partsOnOrder = MOCK_PARTS.filter(p => p.onOrder > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-muted-foreground">Manage inventory, approve part requests, and monitor stock levels</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalParts.length}</div>
            <p className="text-xs text-muted-foreground">Below minimum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSKUs}</div>
            <p className="text-xs text-muted-foreground">Active items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parts On Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partsOnOrder}</div>
            <p className="text-xs text-muted-foreground">Incoming stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Part Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Part Requests</CardTitle>
            <Button asChild>
              <Link to="/part-requests">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{request.id}</p>
                      <Badge variant="outline">{request.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.workOrderTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested by {request.requestedBy} • {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                    <div className="text-sm">
                      {request.parts.length} part(s): {request.parts.map(p => p.partName).join(', ')}
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link to={`/part-requests/${request.id}`}>Review</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Stock Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Critical Stock Levels</CardTitle>
            <Button asChild variant="outline">
              <Link to="/inventory">View Inventory</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {criticalParts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">All parts are adequately stocked</p>
          ) : (
            <div className="space-y-3">
              {criticalParts.slice(0, 5).map((part) => {
                const available = part.onHand - part.reserved;
                return (
                  <div key={part.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {part.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-destructive">
                        {available} / {part.min} min
                      </p>
                      {part.onOrder > 0 && (
                        <p className="text-xs text-muted-foreground">{part.onOrder} on order</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
