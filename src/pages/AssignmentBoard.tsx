import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_WORK_ORDERS } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  Wrench,
  User,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock technicians with availability
const TECHNICIANS = [
  { id: 'user-001', name: 'John Smith', skills: ['Electrical', 'Mechanical'], availability: 'available', currentWOs: 2 },
  { id: 'user-004', name: 'Lisa Chen', skills: ['Mechanical', 'Pneumatics'], availability: 'busy', currentWOs: 4 },
  { id: 'user-005', name: 'David Martinez', skills: ['Electrical', 'Controls'], availability: 'available', currentWOs: 1 },
  { id: 'user-006', name: 'Emma Wilson', skills: ['HVAC', 'Refrigeration'], availability: 'available', currentWOs: 2 },
  { id: 'user-007', name: 'Michael Brown', skills: ['Mechanical', 'Hydraulics'], availability: 'offline', currentWOs: 0 },
  { id: 'user-008', name: 'Sarah Johnson', skills: ['Electrical', 'Instrumentation'], availability: 'available', currentWOs: 3 },
];

export default function AssignmentBoard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Categorize work orders
  const unassignedWOs = MOCK_WORK_ORDERS.filter(wo => wo.status === 'open');
  const assignedWOs = MOCK_WORK_ORDERS.filter(wo => wo.status === 'assigned' || wo.status === 'in_progress');
  
  // Filter by search
  const filteredUnassigned = unassignedWOs.filter(wo =>
    wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignToTech = (woId: string, techId: string) => {
    const tech = TECHNICIANS.find(t => t.id === techId);
    const wo = MOCK_WORK_ORDERS.find(w => w.id === woId);
    
    if (tech && wo) {
      // In production: update database
      toast({
        title: 'Work Order Assigned',
        description: `${wo.id} assigned to ${tech.name}`,
      });
    }
  };

  const getTechWorkOrders = (techId: string) => {
    return assignedWOs.filter(wo => wo.assignees.includes(techId) || wo.assignees.includes(TECHNICIANS.find(t => t.id === techId)?.name || ''));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Board</h1>
          <p className="text-muted-foreground">Assign work orders to available technicians</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Link to="/work-orders/new">
            <Button>New Work Order</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedWOs.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_WORK_ORDERS.filter(wo => wo.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">Active work orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Techs</CardTitle>
            <User className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {TECHNICIANS.filter(t => t.availability === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Load</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(TECHNICIANS.reduce((acc, t) => acc + t.currentWOs, 0) / TECHNICIANS.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">WOs per technician</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Board - Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: Unassigned Work Orders */}
        <Card className="lg:col-span-1">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Unassigned ({filteredUnassigned.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {filteredUnassigned.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No unassigned work orders</p>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  {filteredUnassigned.map((wo) => (
                    <div
                      key={wo.id}
                      className={cn(
                        'rounded-lg border bg-card p-3 transition-all hover:shadow-md',
                        selectedTech && 'cursor-pointer hover:border-primary'
                      )}
                      onClick={() => selectedTech && handleAssignToTech(wo.id, selectedTech)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/work-orders/${wo.id}`} className="flex-1">
                            <span className="font-medium hover:text-primary">{wo.id}</span>
                          </Link>
                          <StatusBadge status={wo.priority} />
                        </div>
                        <p className="text-sm font-medium">{wo.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Wrench className="h-3 w-3" />
                          <span>{wo.equipmentName}</span>
                        </div>
                        {wo.safetyTags && wo.safetyTags.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Safety Required</span>
                          </div>
                        )}
                        {wo.dueBy && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(wo.dueBy).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Column 2-3: Technician Assignment Cards */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {TECHNICIANS.map((tech) => {
              const techWOs = getTechWorkOrders(tech.id);
              const isSelected = selectedTech === tech.id;

              return (
                <Card
                  key={tech.id}
                  className={cn(
                    'transition-all hover:shadow-md',
                    isSelected && 'border-primary shadow-lg'
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{tech.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {tech.skills.join(', ')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={cn(
                            'rounded-full px-2 py-1 text-xs font-medium',
                            tech.availability === 'available' && 'bg-success/10 text-success',
                            tech.availability === 'busy' && 'bg-warning/10 text-warning',
                            tech.availability === 'offline' && 'bg-muted text-muted-foreground'
                          )}
                        >
                          {tech.availability}
                        </span>
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTech(isSelected ? null : tech.id)}
                          disabled={tech.availability === 'offline'}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current Load</span>
                        <span className="font-medium">{techWOs.length} WOs</span>
                      </div>
                      
                      {techWOs.length > 0 && (
                        <div className="space-y-1 border-t pt-2">
                          <p className="text-xs font-medium text-muted-foreground">Assigned Work Orders</p>
                          {techWOs.slice(0, 3).map((wo) => (
                            <Link key={wo.id} to={`/work-orders/${wo.id}`}>
                              <div className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-xs hover:bg-muted">
                                <span className="font-medium">{wo.id}</span>
                                <StatusBadge status={wo.status} />
                              </div>
                            </Link>
                          ))}
                          {techWOs.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{techWOs.length - 3} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedTech && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {TECHNICIANS.find(t => t.id === selectedTech)?.name} selected
                  </span>
                  <span className="text-muted-foreground">
                    - Click any unassigned work order to assign
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
