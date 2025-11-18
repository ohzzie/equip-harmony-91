import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { DiagnosisModal } from '@/components/DiagnosisModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Eye, Search, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function TechnicianWorkOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string | null>(null);

  // Filter work orders - technicians see assigned and in_progress work orders
  const myWorkOrders = MOCK_WORK_ORDERS.filter(
    (wo) =>
      wo.status === 'assigned' ||
      wo.status === 'in_progress' ||
      wo.status === 'completed'
  );

  const filteredWorkOrders = myWorkOrders.filter((wo) => {
    const matchesSearch =
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStartWork = (workOrderId: string) => {
    setSelectedWorkOrder(workOrderId);
    setShowDiagnosisModal(true);
  };

  const handleDiagnosisSubmit = (diagnosis: {
    failureCode: string;
    causeCode: string;
    remedyCode: string;
    diagnosisNotes: string;
  }) => {
    // In production, this would update the work order via API
    toast({
      title: 'Work Started',
      description: 'Diagnosis saved and work order moved to In Progress',
    });

    setShowDiagnosisModal(false);
    setSelectedWorkOrder(null);

    // Navigate to execution page
    if (selectedWorkOrder) {
      navigate(`/work-orders/${selectedWorkOrder}/execute`);
    }
  };

  const calculateLaborHours = (startedAt?: string, completedAt?: string) => {
    if (!startedAt || !completedAt) return '-';
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Work Orders</h1>
        <p className="text-muted-foreground">
          View and manage your assigned work orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myWorkOrders.filter((wo) => wo.status === 'assigned').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myWorkOrders.filter((wo) => wo.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myWorkOrders.filter((wo) => wo.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by WO ID, title, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Labor Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      No work orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkOrders.map((wo) => (
                    <TableRow key={wo.id}>
                      <TableCell className="font-medium">{wo.id}</TableCell>
                      <TableCell>{wo.title}</TableCell>
                      <TableCell>{wo.equipmentName}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-muted">
                          {wo.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={wo.status} />
                      </TableCell>
                      <TableCell>
                        {wo.assignees && wo.assignees.length > 0
                          ? wo.assignees.join(', ')
                          : '-'}
                      </TableCell>
                      <TableCell>{wo.assignedBy || '-'}</TableCell>
                      <TableCell>
                        {wo.reportedAt
                          ? format(new Date(wo.reportedAt), 'dd/MM/yyyy HH:mm')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {wo.startedAt
                          ? format(new Date(wo.startedAt), 'dd/MM/yyyy HH:mm')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {wo.completedAt
                          ? format(new Date(wo.completedAt), 'dd/MM/yyyy HH:mm')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {calculateLaborHours(wo.startedAt, wo.completedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <Link to={`/work-orders/${wo.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {wo.status === 'assigned' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartWork(wo.id)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {wo.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowDiagnosisModal(true)}
                            >
                              <Stethoscope className="h-4 w-4 mr-1" />
                              Diagnosis
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Modal */}
      <DiagnosisModal
        open={showDiagnosisModal}
        onOpenChange={setShowDiagnosisModal}
        onSubmit={handleDiagnosisSubmit}
      />
    </div>
  );
}
