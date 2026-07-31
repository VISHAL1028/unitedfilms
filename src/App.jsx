import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/services/ServicePage";
import EquipmentPage from "./pages/equipment/EquipmentPage";
import OurWorkPage from "./pages/OurWorkPage";
import ScrollToTop from "./components/ScrollToTop";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import EquipmentForm from "./pages/admin/EquipmentForm";
import MessagesPage from "./pages/admin/MessagesPage";
import WorksManager from "./pages/admin/WorksManager";
import { ThemeProvider } from "./hooks/useTheme";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services/:serviceId" element={<ServicePage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/our-work" element={<OurWorkPage />} />
            
            {/* Admin Auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin CMS routes (Protected) */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/equipment" element={
              <ProtectedRoute>
                <EquipmentForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/works" element={
              <ProtectedRoute>
                <WorksManager />
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
