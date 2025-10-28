import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_EQUIPMENT, getEquipmentStats } from '@/lib/mockData';
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
  Search,
  Filter,
  ArrowUpDown,
  Package,
  TrendingUp,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'repairs' | 'nextPM'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Calculate enriched equipment data with stats
  const enrichedEquipment = useMemo(() => {
    return MOCK_EQUIPMENT.map(eq => ({
      ...eq,
      stats: getEquipmentStats(eq.id)
    }));
  }, []);

  // Filter and sort
  const filteredEquipment = useMemo(() => {
    let filtered = enrichedEquipment.filter(eq =>
      searchTerm === '' ||
      eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.fleetNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'cost':
          compareValue = (a.stats.totalCost || 0) - (b.stats.totalCost || 0);
          break;
        case 'repairs':
          compareValue = (a.stats.completedWorkOrders || 0) - (b.stats.completedWorkOrders || 0);
          break;
        case 'nextPM':
          compareValue = (a.nextPM || '').localeCompare(b.nextPM || '');
          break;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [enrichedEquipment, searchTerm, sortBy, sortOrder]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalEquipment = MOCK_EQUIPMENT.length;
    const serviceable = MOCK_EQUIPMENT.filter(eq => eq.status === 'serviceable').length;
    const totalValue = MOCK_EQUIPMENT.reduce((sum, eq) => sum + (eq.purchaseValue || 0), 0);
    const totalMaintenanceCost = enrichedEquipment.reduce((sum, eq) => sum + eq.stats.totalCost, 0);
    const pendingMaintenance = MOCK_EQUIPMENT.filter(eq => eq.status === 'pending' || eq.status === 'unserviceable').length;

    return {
      totalEquipment,
      serviceable,
      serviceablePercent: ((serviceable / totalEquipment) * 100).toFixed(1),
      totalValue,
      totalMaintenanceCost,
      pendingMaintenance,
    };
  }, [enrichedEquipment]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Registry</h1>
        <p className="text-muted-foreground">Comprehensive fleet management and maintenance tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalEquipment}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.serviceablePercent}% serviceable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total purchase value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by fleet #, name, type, or location..."
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => toggleSort('name')}
                    >
                      Equipment
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => toggleSort('repairs')}
                    >
                      Repairs
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Labor Hrs</TableHead>
                  <TableHead>Last Technician</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => toggleSort('nextPM')}
                    >
                      Next PM
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{eq.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {eq.fleetNumber && `Fleet #${eq.fleetNumber} • `}
                          {eq.equipmentType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{eq.site}</div>
                        <div className="text-xs text-muted-foreground">{eq.area}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={eq.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{eq.stats.completedWorkOrders}</div>
                      <div className="text-xs text-muted-foreground">
                        of {eq.stats.totalWorkOrders} total
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {eq.stats.totalLaborHours > 0 ? (
                        <div>
                          <div className="font-medium">{eq.stats.totalLaborHours.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground">
                            Avg: {eq.stats.averageLaborHoursPerRepair.toFixed(1)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[120px] truncate text-sm">
                        {eq.stats.mostFrequentTechnician || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[120px] truncate text-sm">
                        {eq.stats.mostFrequentAssigner || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {eq.nextPM ? (
                        <span className="text-sm">{new Date(eq.nextPM).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link to={`/equipment/${eq.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEquipment.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No equipment found matching your search
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}