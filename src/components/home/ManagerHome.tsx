import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MANAGER_KPIS } from '@/lib/mockData';
import { 
  TrendingDown,
  TrendingUp,
  Minus,
  BarChart3,
  Clock,
  DollarSign,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
  'MTTR (Hours)': Clock,
  'MTTB (Hours)': Clock,
  '% Serviceable': Wrench,
  'Open Work Orders': BarChart3,
  'Overdue': AlertTriangle,
  'MTD Cost': DollarSign,
};

export function ManagerHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reliability Dashboard</h1>
          <p className="text-muted-foreground">KPIs, trends, and asset performance</p>
        </div>
        <Link to="/reports">
          <Button className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Full Reports
          </Button>
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {MANAGER_KPIS.map((kpi) => {
          const Icon = ICON_MAP[kpi.label] || BarChart3;
          const TrendIcon = kpi.trend === 'up' 
            ? TrendingUp 
            : kpi.trend === 'down' 
            ? TrendingDown 
            : Minus;
          
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.change !== undefined && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    kpi.trend === 'up' && kpi.label !== 'MTTB (Hours)' && kpi.label !== '% Serviceable' && "text-destructive",
                    kpi.trend === 'down' && (kpi.label === 'MTTR (Hours)' || kpi.label === 'Overdue' || kpi.label === 'Open Work Orders') && "text-success",
                    kpi.trend === 'up' && (kpi.label === 'MTTB (Hours)' || kpi.label === '% Serviceable') && "text-success",
                  )}>
                    <TrendIcon className="h-3 w-3" />
                    {Math.abs(kpi.change)}%
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>MTTR Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end justify-between gap-2">
              {[4.2, 3.8, 3.5, 3.9, 3.2, 3.0, 3.2].map((value, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t bg-primary transition-all hover:bg-primary-hover"
                    style={{ height: `${(value / 5) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Open</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="h-2 rounded-full bg-status-open">
                  <div className="h-full w-[17%] rounded-full bg-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="h-2 rounded-full bg-status-progress">
                  <div className="h-full w-[32%] rounded-full bg-accent" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="h-2 rounded-full bg-status-completed">
                  <div className="h-full w-[51%] rounded-full bg-success" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Status */}
      <Card>
        <CardHeader>
          <CardTitle>Critical Equipment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Pump #3 - Line A', status: 'serviceable', lastPM: '2 days ago', nextPM: '28 days' },
              { name: 'Conveyor Belt C2', status: 'serviceable', lastPM: '5 days ago', nextPM: '25 days' },
              { name: 'HVAC Unit - Building 1', status: 'serviceable', lastPM: '1 day ago', nextPM: '89 days' },
              { name: 'CNC Machine M5', status: 'serviceable', lastPM: '3 days ago', nextPM: '362 days' },
            ].map((equipment) => (
              <div key={equipment.name} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <div>
                    <p className="font-medium">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last PM: {equipment.lastPM} • Next: {equipment.nextPM}
                    </p>
                  </div>
                </div>
                <Link to="/equipment">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
