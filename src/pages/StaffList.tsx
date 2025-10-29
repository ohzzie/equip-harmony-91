import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Mail, MapPin, Award } from 'lucide-react';

// Mock staff data
const MOCK_STAFF = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@emms.com',
    role: 'technician',
    site: 'LOS',
    skills: ['Electrical', 'Mechanical', 'HVAC'],
    certifications: ['LOTO', 'Confined Space'],
    activeWorkOrders: 3,
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@emms.com',
    role: 'planner',
    site: 'ABV',
    skills: ['Planning', 'Scheduling'],
    certifications: ['PMP'],
    activeWorkOrders: 0,
  },
  {
    id: 'user-003',
    name: 'Mike Davis',
    email: 'mike.davis@emms.com',
    role: 'ops_rep',
    site: 'LOS',
    skills: ['Operations', 'Quality Control'],
    certifications: ['ISO 9001'],
    activeWorkOrders: 0,
  },
  {
    id: 'user-004',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@emms.com',
    role: 'manager_maintenance',
    site: 'LOS',
    skills: ['Management', 'Strategy'],
    certifications: ['MBA', 'PMP'],
    activeWorkOrders: 0,
  },
  {
    id: 'user-005',
    name: 'David Wilson',
    email: 'david.wilson@emms.com',
    role: 'inventory_manager',
    site: 'PHC',
    skills: ['Inventory Management', 'Procurement'],
    certifications: ['CPIM'],
    activeWorkOrders: 0,
  },
  {
    id: 'user-006',
    name: 'Emily Brown',
    email: 'emily.brown@emms.com',
    role: 'engineer',
    site: 'ABV',
    skills: ['Mechanical', 'Diagnostics', 'Calibration'],
    certifications: ['PE', 'Six Sigma'],
    activeWorkOrders: 5,
  },
  {
    id: 'user-007',
    name: 'Robert Taylor',
    email: 'robert.taylor@emms.com',
    role: 'technician',
    site: 'PHC',
    skills: ['Hydraulics', 'Pneumatics'],
    certifications: ['LOTO', 'First Aid'],
    activeWorkOrders: 2,
  },
];

const ROLE_LABELS: Record<string, string> = {
  technician: 'Technician',
  engineer: 'Engineer',
  planner: 'Planner',
  coordinator: 'Coordinator',
  ops_staff: 'Operations Staff',
  ops_rep: 'Operations Rep',
  manager_asset: 'Asset Manager',
  manager_maintenance: 'Maintenance Manager',
  inventory_manager: 'Inventory Manager',
  reliability: 'Reliability Engineer',
  admin: 'Administrator',
};

export default function StaffList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterSite, setFilterSite] = useState<string>('all');

  const filteredStaff = MOCK_STAFF.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    const matchesSite = filterSite === 'all' || staff.site === filterSite;

    return matchesSearch && matchesRole && matchesSite;
  });

  const roles = Array.from(new Set(MOCK_STAFF.map(s => s.role)));
  const sites = Array.from(new Set(MOCK_STAFF.map(s => s.site)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
        <p className="text-muted-foreground">Manage and view all staff members</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_STAFF.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STAFF.filter(s => s.role === 'technician' || s.role === 'engineer').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_STAFF.reduce((sum, s) => sum + s.activeWorkOrders, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filterSite}
                onChange={(e) => setFilterSite(e.target.value)}
              >
                <option value="all">All Sites</option>
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Certifications</TableHead>
              <TableHead className="text-right">Active WOs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{ROLE_LABELS[staff.role]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {staff.site}
                  </div>
                </TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${staff.email}`}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-3 w-3" />
                    {staff.email}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {staff.skills.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {staff.skills.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{staff.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{staff.certifications.length}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={staff.activeWorkOrders > 0 ? 'default' : 'secondary'}>
                    {staff.activeWorkOrders}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredStaff.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No staff members found
          </div>
        )}
      </Card>
    </div>
  );
}
