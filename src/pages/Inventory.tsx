import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MOCK_PARTS } from '@/lib/mockData';
import { 
  Search,
  Filter,
  Package,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParts = MOCK_PARTS.filter(part =>
    searchTerm === '' ||
    part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (part: typeof MOCK_PARTS[0]) => {
    const available = part.onHand - part.reserved;
    if (available <= part.min) return 'critical';
    if (available <= part.min * 1.5) return 'low';
    return 'ok';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Parts, stock levels, and reservations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_PARTS.length}</div>
            <p className="text-xs text-muted-foreground">Active parts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Below Min</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {MOCK_PARTS.filter(p => getStockStatus(p) === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">Needs reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Order</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_PARTS.filter(p => p.onOrder > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_PARTS.reduce((sum, p) => sum + p.reserved, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total reserved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search parts by SKU, name, or category..."
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
          <div className="space-y-3">
            {filteredParts.map(part => {
              const status = getStockStatus(part);
              const available = part.onHand - part.reserved;

              return (
                <Card key={part.id} className={cn(
                  "border-l-4",
                  status === 'critical' && "border-l-destructive",
                  status === 'low' && "border-l-warning",
                  status === 'ok' && "border-l-success"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{part.sku}</span>
                          <Badge variant="outline">{part.category}</Badge>
                          {status === 'critical' && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Below Min
                            </Badge>
                          )}
                          {status === 'low' && (
                            <Badge variant="outline" className="border-warning text-warning gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{part.name}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={cn(
                            "font-medium",
                            status === 'critical' && "text-destructive",
                            status === 'low' && "text-warning",
                            status === 'ok' && "text-success"
                          )}>
                            Available: {available} {part.uom}
                          </span>
                          <span className="text-muted-foreground">On Hand: {part.onHand}</span>
                          <span className="text-muted-foreground">Reserved: {part.reserved}</span>
                          {part.onOrder > 0 && (
                            <span className="text-warning">On Order: {part.onOrder}</span>
                          )}
                          <span className="text-muted-foreground">
                            Min/Max: {part.min}/{part.max}
                          </span>
                        </div>
                        {part.substitutes && part.substitutes.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Substitutes:</span>
                            {part.substitutes.map(sub => (
                              <Badge key={sub} variant="outline" className="text-xs">
                                {sub}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-lg font-bold">
                          ${part.unitCost.toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Reserve</Button>
                          <Button variant="outline" size="sm">Issue</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
