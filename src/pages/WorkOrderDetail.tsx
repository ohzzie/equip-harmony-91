import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_WORK_ORDERS, MOCK_EQUIPMENT, MOCK_PARTS } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Wrench, 
  User, 
  Package, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  Save
} from 'lucide-react';

// Mock technicians - in production, fetch from database
const MOCK_TECHNICIANS = [
  { id: 'user-001', name: 'John Smith', skills: ['Electrical', 'Mechanical', 'HVAC'] },
  { id: 'user-004', name: 'Lisa Chen', skills: ['Mechanical', 'Pneumatics'] },
  { id: 'user-005', name: 'David Martinez', skills: ['Electrical', 'Controls'] },
  { id: 'user-006', name: 'Emma Wilson', skills: ['HVAC', 'Refrigeration'] },
];

export default function WorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const workOrder = MOCK_WORK_ORDERS.find(wo => wo.id === id);
  const equipment = MOCK_EQUIPMENT.find(e => e.id === workOrder?.equipmentId);

  const [diagnosis, setDiagnosis] = useState(workOrder?.description || '');
  const [failureCode, setFailureCode] = useState(workOrder?.failureCode || '');
  const [causeCode, setCauseCode] = useState(workOrder?.causeCode || '');
  const [remedyCode, setRemedyCode] = useState(workOrder?.remedyCode || '');
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>(workOrder?.assignees || []);
  const [selectedParts, setSelectedParts] = useState<Array<{ partId: string; quantity: number }>>([]);
  const [newPartId, setNewPartId] = useState('');
  const [newPartQty, setNewPartQty] = useState(1);

  if (!workOrder) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Work order not found</p>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate('/work-orders')}>
                Back to Work Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = user?.role === 'planner' || user?.role === 'coordinator' || user?.role === 'manager_asset' || user?.role === 'manager_maintenance';
  const isUnassigned = workOrder.status === 'open';

  const toggleTechnician = (techId: string) => {
    setSelectedTechnicians(prev =>
      prev.includes(techId) ? prev.filter(id => id !== techId) : [...prev, techId]
    );
  };

  const addPart = () => {
    if (!newPartId) {
      toast({ variant: 'destructive', description: 'Please select a part' });
      return;
    }

    const part = MOCK_PARTS.find(p => p.id === newPartId);
    if (!part) return;

    // Stock check
    const availableStock = part.onHand - part.reserved;
    if (availableStock < newPartQty) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Stock',
        description: `Only ${availableStock} units available. Part may need to be ordered.`
      });
      return;
    }

    setSelectedParts(prev => [...prev, { partId: newPartId, quantity: newPartQty }]);
    setNewPartId('');
    setNewPartQty(1);
    
    toast({
      description: `${part.name} reserved (${newPartQty} ${part.uom})`
    });
  };

  const removePart = (partId: string) => {
    setSelectedParts(prev => prev.filter(p => p.partId !== partId));
  };

  const handleAssign = () => {
    // Business rule: Must assign at least one technician
    if (selectedTechnicians.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Assignment Required',
        description: 'Must assign at least one technician'
      });
      return;
    }

    // In production: update database with diagnosis, codes, assignments, and parts
    toast({
      title: 'Work Order Assigned',
      description: `Assigned to ${selectedTechnicians.length} technician(s) with ${selectedParts.length} part(s) reserved`
    });

    // Navigate back to work orders list
    setTimeout(() => navigate('/work-orders'), 1500);
  };

  const handleSave = () => {
    toast({
      description: 'Work order updated successfully'
    });
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/work-orders')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workOrder.id}</h1>
            <p className="text-muted-foreground">{workOrder.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={workOrder.status} />
          <StatusBadge status={workOrder.priority} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Work Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Equipment</Label>
                  <p className="font-medium">{workOrder.equipmentName}</p>
                  <p className="text-sm text-muted-foreground">{equipment?.asset}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{workOrder.area}</p>
                  <p className="text-sm text-muted-foreground">{workOrder.site}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{workOrder.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Requested By</Label>
                  <p className="font-medium">{workOrder.requester}</p>
                </div>
              </div>

              {workOrder.safetyTags && workOrder.safetyTags.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Safety Tags</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {workOrder.safetyTags.map(tag => (
                      <span key={tag} className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1 text-sm">{workOrder.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis & Planning (Editable by planner) */}
          {canEdit && isUnassigned && (
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis & Solution Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="diagnosis">Diagnosis Notes</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Describe the issue and planned solution..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="failureCode">Failure Code</Label>
                    <Input
                      id="failureCode"
                      placeholder="e.g., F-001"
                      value={failureCode}
                      onChange={(e) => setFailureCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="causeCode">Cause Code</Label>
                    <Input
                      id="causeCode"
                      placeholder="e.g., C-001"
                      value={causeCode}
                      onChange={(e) => setCauseCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="remedyCode">Remedy Code</Label>
                    <Input
                      id="remedyCode"
                      placeholder="e.g., R-001"
                      value={remedyCode}
                      onChange={(e) => setRemedyCode(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} variant="outline" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Diagnosis
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Assignment Section */}
          {canEdit && isUnassigned && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assign Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {MOCK_TECHNICIANS.map(tech => (
                    <div key={tech.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <Checkbox
                        id={tech.id}
                        checked={selectedTechnicians.includes(tech.id)}
                        onCheckedChange={() => toggleTechnician(tech.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={tech.id} className="cursor-pointer font-medium">
                          {tech.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Skills: {tech.skills.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTechnicians.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    ⚠️ At least one technician must be assigned
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Parts Reservation */}
          {canEdit && isUnassigned && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Reserve Parts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Part Form */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={newPartId} onValueChange={setNewPartId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select part..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_PARTS.map(part => (
                          <SelectItem key={part.id} value={part.id}>
                            {part.name} ({part.sku}) - {part.onHand - part.reserved} available
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    className="w-24"
                    value={newPartQty}
                    onChange={(e) => setNewPartQty(parseInt(e.target.value) || 1)}
                  />
                  <Button onClick={addPart}>Add</Button>
                </div>

                {/* Selected Parts List */}
                {selectedParts.length > 0 && (
                  <div className="space-y-2">
                    <Label>Reserved Parts</Label>
                    {selectedParts.map(({ partId, quantity }) => {
                      const part = MOCK_PARTS.find(p => p.id === partId);
                      return part ? (
                        <div key={partId} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{part.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {quantity} {part.uom} • Cost: ${(part.unitCost * quantity).toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePart(partId)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assign Button */}
          {canEdit && isUnassigned && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <Button
                  onClick={handleAssign}
                  size="lg"
                  className="w-full"
                  disabled={selectedTechnicians.length === 0}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Assign Work Order & Reserve Parts
                </Button>
                {selectedTechnicians.length === 0 && (
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    Select at least one technician to proceed
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Already Assigned Info */}
          {workOrder.status !== 'open' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <div className="space-y-1">
                    {workOrder.assignees.map(assignee => (
                      <p key={assignee} className="text-sm">{assignee}</p>
                    ))}
                  </div>
                  {workOrder.failureCode && (
                    <div className="mt-4">
                      <Label>Codes</Label>
                      <p className="text-sm">
                        Failure: {workOrder.failureCode} • 
                        Cause: {workOrder.causeCode} • 
                        Remedy: {workOrder.remedyCode}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary p-1">
                    <div className="h-2 w-2 rounded-full bg-background" />
                  </div>
                  <div className="h-full w-px bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">Reported</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(workOrder.reportedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {workOrder.dueBy && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full border-2 border-primary p-1">
                      <div className="h-2 w-2 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Due By</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workOrder.dueBy).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipment Info */}
          {equipment && (
            <Card>
              <CardHeader>
                <CardTitle>Equipment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p>{equipment.type}</p>
                </div>
                {equipment.manufacturer && (
                  <div>
                    <Label className="text-muted-foreground">Manufacturer</Label>
                    <p>{equipment.manufacturer}</p>
                  </div>
                )}
                {equipment.model && (
                  <div>
                    <Label className="text-muted-foreground">Model</Label>
                    <p>{equipment.model}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={equipment.status} />
                  </div>
                </div>
                <Link to={`/equipment/${equipment.id}`}>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    View Equipment Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
