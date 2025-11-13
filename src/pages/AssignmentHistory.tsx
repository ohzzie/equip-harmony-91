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
      <div className="border rounded-lg overflow-hidden bg-background">
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-8">
                  No assignment history found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell>{wo.id}</TableCell>
                  <TableCell>{wo.title}</TableCell>
                  <TableCell>{wo.equipmentName}</TableCell>
                  <TableCell>{wo.type}</TableCell>
                  <TableCell>{wo.priority}</TableCell>
                  <TableCell>{wo.status}</TableCell>
                  <TableCell>{wo.assignees.join(', ')}</TableCell>
                  <TableCell>{wo.assignedBy || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(wo.stateEnteredAt).toLocaleDateString()} {new Date(wo.stateEnteredAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {wo.scheduledAt ? new Date(wo.scheduledAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {wo.startedAt ? `${new Date(wo.startedAt).toLocaleDateString()} ${new Date(wo.startedAt).toLocaleTimeString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    {wo.completedAt ? `${new Date(wo.completedAt).toLocaleDateString()} ${new Date(wo.completedAt).toLocaleTimeString()}` : '-'}
                  </TableCell>
                  <TableCell>{wo.laborHours || '-'}</TableCell>
                  <TableCell>
                    <Link to={`/work-orders/${wo.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
