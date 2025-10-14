import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_EQUIPMENT } from '@/lib/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Search,
  Filter,
  Wrench,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipment = MOCK_EQUIPMENT.filter(eq =>
    searchTerm === '' ||
    eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipment Registry</h1>
        <p className="text-muted-foreground">Asset management and maintenance history</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
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
          <div className="space-y-4">
            {filteredEquipment.map(eq => (
              <Card key={eq.id} className="overflow-hidden">
                <div className="flex">
                  <div className="flex-1 p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{eq.name}</h3>
                            <StatusBadge status={eq.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {eq.id} • {eq.type}
                          </p>
                        </div>
                        <Link to={`/equipment/${eq.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="text-sm font-medium">
                            {eq.site} • {eq.area}
                            {eq.line && ` • ${eq.line}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Manufacturer</p>
                          <p className="text-sm font-medium">{eq.manufacturer || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Model</p>
                          <p className="text-sm font-medium">{eq.model || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Serial Number</p>
                          <p className="text-sm font-medium">{eq.serialNumber || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">MTTR</p>
                            <p className="text-sm font-medium">{eq.mttr} hrs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">MTTB</p>
                            <p className="text-sm font-medium">{eq.mttb} hrs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">PM Cadence</p>
                            <p className="text-sm font-medium">{eq.pmCadence || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Next PM</p>
                            <p className="text-sm font-medium">{eq.nextPM || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {eq.specs && (
                        <div className="pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Specifications</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(eq.specs).map(([key, value]) => (
                              <span key={key} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
