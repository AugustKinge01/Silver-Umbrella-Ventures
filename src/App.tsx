
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import { OneChainProvider } from "./contexts/OneChainContext";

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
      <OneChainProvider>
        <AuthProvider>
          <PlanProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
                  <Route path="/vouchers" element={<ProtectedRoute><VouchersPage /></ProtectedRoute>} />
                  <Route path="/hotspots" element={<ProtectedRoute><HotspotsPage /></ProtectedRoute>} />
                  <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                  <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/plans" element={<AdminRoute><AdminPlans /></AdminRoute>} />
                  <Route path="/admin/vouchers" element={<AdminRoute><AdminVouchers /></AdminRoute>} />
                  <Route path="/admin/rewards" element={<AdminRoute><AdminRewards /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                  <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
                  <Route path="/admin/support" element={<AdminRoute><AdminSupport /></AdminRoute>} />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </PlanProvider>
        </AuthProvider>
      </OneChainProvider>
    </QueryClientProvider>
);

export default App;
