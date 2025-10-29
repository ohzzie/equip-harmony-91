import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderExecution from "./pages/WorkOrderExecution";
import NewWorkOrder from "./pages/NewWorkOrder";
import AssignmentBoard from "./pages/AssignmentBoard";
import AssignmentHistory from "./pages/AssignmentHistory";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Inventory from "./pages/Inventory";
import PartRequests from "./pages/PartRequests";
import StaffList from "./pages/StaffList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="work-orders" element={<WorkOrders />} />
              <Route path="work-orders/:id" element={<WorkOrderDetail />} />
              <Route path="work-orders/:id/execute" element={<WorkOrderExecution />} />
              <Route path="work-orders/new" element={<NewWorkOrder />} />
              <Route path="assignment" element={<AssignmentBoard />} />
              <Route path="assignment-history" element={<AssignmentHistory />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="part-requests" element={<PartRequests />} />
              <Route path="equipment" element={<Equipment />} />
              <Route path="equipment/:id" element={<EquipmentDetail />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="verify" element={<Dashboard />} />
              <Route path="reports" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
