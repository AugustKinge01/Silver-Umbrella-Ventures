
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import { Web3Provider } from "./contexts/Web3Context";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlansPage from "./pages/PlansPage";
import VouchersPage from "./pages/VouchersPage";
import HotspotsPage from "./pages/HotspotsPage";
import SupportPage from "./pages/SupportPage";
import RewardsPage from "./pages/RewardsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSupport from "./pages/admin/AdminSupport";
import NotFound from "./pages/NotFound";

// Component for protected routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <AuthProvider>
          <PlanProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
...
              </BrowserRouter>
            </TooltipProvider>
          </PlanProvider>
        </AuthProvider>
      </Web3Provider>
    </QueryClientProvider>
);

export default App;
