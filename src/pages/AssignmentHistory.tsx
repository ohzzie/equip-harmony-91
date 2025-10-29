import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { Search, Calendar, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';

export default function AssignmentHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Get all work orders that have been assigned (sorted by most recent assignment)
  const assignedOrders = MOCK_WORK_ORDERS
    .filter(wo => wo.assignees.length > 0)
    .sort((a, b) => new Date(b.stateEnteredAt).getTime() - new Date(a.stateEnteredAt).getTime());

  const filteredOrders = assignedOrders.filter(wo =>
    wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.assignees.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignment History</h1>
        <p className="text-muted-foreground">View historical work order assignments</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by ID, equipment, title, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredOrders.map((wo) => (
          <Card key={wo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{wo.id}</CardTitle>
                    <StatusBadge status={wo.status} />
                    <Badge variant="outline">{wo.type}</Badge>
                    <Badge
                      variant={
                        wo.priority === 'critical'
                          ? 'destructive'
                          : wo.priority === 'high'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {wo.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{wo.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Equipment: {wo.equipmentName}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/work-orders/${wo.id}`}>View Details</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wo.assignees.map((assignee, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {assignee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Assigned By</p>
                    <p className="text-sm text-muted-foreground">
                      {wo.assignedBy || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Date Assigned</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(wo.stateEnteredAt).toLocaleDateString()} at{' '}
                      {new Date(wo.stateEnteredAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {wo.scheduledAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Scheduled For</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(wo.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {wo.startedAt && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Started</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(wo.startedAt).toLocaleDateString()} at{' '}
                        {new Date(wo.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {wo.completedAt && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(wo.completedAt).toLocaleDateString()} at{' '}
                        {new Date(wo.completedAt).toLocaleTimeString()}
                      </p>
                      {wo.laborHours && (
                        <p className="text-xs text-muted-foreground">
                          {wo.laborHours} labor hours
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No assignment history found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
