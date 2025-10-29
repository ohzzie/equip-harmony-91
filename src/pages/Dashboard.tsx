import { useAuth } from '@/contexts/AuthContext';
import { TechnicianHome } from '@/components/home/TechnicianHome';
import { PlannerHome } from '@/components/home/PlannerHome';
import { OpsHome } from '@/components/home/OpsHome';
import { ManagerHome } from '@/components/home/ManagerHome';
import { InventoryManagerHome } from '@/components/home/InventoryManagerHome';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'technician':
    case 'engineer':
      return <TechnicianHome />;
    
    case 'planner':
    case 'coordinator':
      return <PlannerHome />;
    
    case 'ops_staff':
    case 'ops_rep':
      return <OpsHome />;
    
    case 'inventory_manager':
      return <InventoryManagerHome />;
    
    case 'manager_asset':
    case 'manager_maintenance':
    case 'reliability':
    case 'admin':
      return <ManagerHome />;
    
    default:
      return <TechnicianHome />;
  }
}
