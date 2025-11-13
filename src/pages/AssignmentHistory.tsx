import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

      {/* History Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Assigned By</TableHead>
                <TableHead>Date Assigned</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Labor Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-12 text-muted-foreground">
                    No assignment history found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((wo) => (
                  <TableRow key={wo.id}>
                    <TableCell className="font-medium">{wo.id}</TableCell>
                    <TableCell>{wo.title}</TableCell>
                    <TableCell>{wo.equipmentName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{wo.type}</Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={wo.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {wo.assignees.map((assignee, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {assignee}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{wo.assignedBy || 'N/A'}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(wo.stateEnteredAt).toLocaleDateString()}<br />
                      <span className="text-muted-foreground text-xs">
                        {new Date(wo.stateEnteredAt).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {wo.scheduledAt
                        ? new Date(wo.scheduledAt).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {wo.startedAt ? (
                        <div className="text-sm">
                          {new Date(wo.startedAt).toLocaleDateString()}<br />
                          <span className="text-muted-foreground text-xs">
                            {new Date(wo.startedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {wo.completedAt ? (
                        <div className="text-sm">
                          {new Date(wo.completedAt).toLocaleDateString()}<br />
                          <span className="text-muted-foreground text-xs">
                            {new Date(wo.completedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{wo.laborHours || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/work-orders/${wo.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
