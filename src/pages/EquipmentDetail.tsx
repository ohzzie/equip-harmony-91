import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_EQUIPMENT, getEquipmentStats, getEquipmentWorkHistory } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Wrench,
  TrendingUp,
  User,
  FileText,
} from 'lucide-react';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const equipment = MOCK_EQUIPMENT.find(eq => eq.id === id);
  const stats = equipment ? getEquipmentStats(equipment.id) : null;
  const workHistory = equipment ? getEquipmentWorkHistory(equipment.id) : [];

  if (!equipment) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Equipment not found</p>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate('/equipment')}>
                Back to Equipment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: equipment.purchaseCurrency || 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/equipment')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
            <p className="text-muted-foreground">
              {equipment.fleetNumber && `Fleet #${equipment.fleetNumber} • `}
              {equipment.id}
            </p>
          </div>
        </div>
        <StatusBadge status={equipment.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Equipment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Equipment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Equipment Type</p>
                  <p className="font-medium">{equipment.equipmentType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Asset Type</p>
                  <p className="font-medium">{equipment.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Manufacturer</p>
                  <p className="font-medium">{equipment.manufacturer || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Model</p>
                  <p className="font-medium">{equipment.model || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Serial Number</p>
                  <p className="font-medium">{equipment.serialNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Condition</p>
                  <p className="font-medium">{equipment.condition || 'N/A'}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-3">Location & Assignment</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{equipment.site} - {equipment.area}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{equipment.currentCustodian || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Current Custodian</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{equipment.assignedDepartment || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Department</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{equipment.totalOperatingHours?.toLocaleString() || 'N/A'} hrs</p>
                      <p className="text-xs text-muted-foreground">Operating Hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {equipment.specs && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Specifications</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {Object.entries(equipment.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between rounded-lg border p-2">
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {equipment.remarks && (
                <div className="rounded-lg border border-warning/50 bg-warning/5 p-4">
                  <p className="text-sm font-medium text-warning mb-1">Remarks</p>
                  <p className="text-sm">{equipment.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Order History ({workHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>WO #</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Technicians</TableHead>
                        <TableHead className="text-right">Labor (hrs)</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workHistory.map((wo) => (
                        <TableRow key={wo.workOrderId}>
                          <TableCell>
                            <Link 
                              to={`/work-orders/${wo.workOrderId}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {wo.workOrderId}
                            </Link>
                          </TableCell>
                          <TableCell className="capitalize">{wo.type}</TableCell>
                          <TableCell>
                            {new Date(wo.startedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{wo.assignedBy}</TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate" title={wo.assignedTo.join(', ')}>
                              {wo.assignedTo.length > 0 ? wo.assignedTo.join(', ') : 'Unassigned'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {wo.laborHours?.toFixed(1) || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {wo.totalCost ? formatCurrency(wo.totalCost) : '-'}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={wo.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No work order history available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Purchase Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {equipment.dateOfPurchase && (
                <div>
                  <p className="text-xs text-muted-foreground">Date of Purchase</p>
                  <p className="text-sm font-medium">
                    {new Date(equipment.dateOfPurchase).toLocaleDateString()}
                  </p>
                </div>
              )}
              {equipment.purchaseValue && (
                <div>
                  <p className="text-xs text-muted-foreground">Purchase Value</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(equipment.purchaseValue)}
                  </p>
                </div>
              )}
              {equipment.supplier && (
                <div>
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="text-sm font-medium">{equipment.supplier}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Maintenance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Work Orders</p>
                  <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedWorkOrders} completed
                  </p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground">Total Maintenance Cost</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(stats.totalCost)}
                  </p>
                </div>
                {stats.completedWorkOrders > 0 && (
                  <>
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground">Avg Cost per Repair</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(stats.averageCostPerRepair)}
                      </p>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground">Total Labor Hours</p>
                      <p className="text-lg font-semibold">
                        {stats.totalLaborHours.toFixed(1)} hrs
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg: {stats.averageLaborHoursPerRepair.toFixed(1)} hrs/repair
                      </p>
                    </div>
                  </>
                )}
                {stats.mostFrequentTechnician && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground">Most Frequent Technician</p>
                    <p className="text-sm font-medium">{stats.mostFrequentTechnician}</p>
                  </div>
                )}
                {stats.mostFrequentAssigner && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground">Most Frequent Assigner</p>
                    <p className="text-sm font-medium">{stats.mostFrequentAssigner}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* PM Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                PM Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Cadence</p>
                <p className="text-sm font-medium">{equipment.pmCadence || 'N/A'}</p>
              </div>
              {equipment.lastPM && (
                <div>
                  <p className="text-xs text-muted-foreground">Last PM</p>
                  <p className="text-sm font-medium">
                    {new Date(equipment.lastPM).toLocaleDateString()}
                  </p>
                </div>
              )}
              {equipment.nextPM && (
                <div>
                  <p className="text-xs text-muted-foreground">Next PM Due</p>
                  <p className="text-sm font-medium">
                    {new Date(equipment.nextPM).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground">Performance Metrics</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">MTTR</span>
                    <span className="text-xs font-medium">{equipment.mttr} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">MTTB</span>
                    <span className="text-xs font-medium">{equipment.mttb} hrs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}