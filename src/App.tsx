import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider, useData } from "@/context/DataContext";
import Login from "./pages/Login";
import UploadWizard from "./pages/UploadWizard";
import DashboardLayout from "./components/DashboardLayout";
import ExecutiveSummary from "./pages/dashboard/ExecutiveSummary";
import OrderSchedule from "./pages/dashboard/OrderSchedule";
import InventoryFlow from "./pages/dashboard/InventoryFlow";
import WasteShortage from "./pages/dashboard/WasteShortage";
import ItemDetails from "./pages/dashboard/ItemDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useData();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function DataGuard({ children }: { children: React.ReactNode }) {
  const { dashboardData } = useData();
  console.log(dashboardData)
  if (!dashboardData) return <Navigate to="/upload" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/upload" element={<AuthGuard><UploadWizard /></AuthGuard>} />
      <Route path="/dashboard" element={<AuthGuard><DataGuard><DashboardLayout /></DataGuard></AuthGuard>}>
        <Route index element={<ExecutiveSummary />} />
        <Route path="orders" element={<OrderSchedule />} />
        <Route path="inventory" element={<InventoryFlow />} />
        <Route path="waste" element={<WasteShortage />} />
        <Route path="items" element={<ItemDetails />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
