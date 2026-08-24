import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import ScrollToTop from "./components/ScrollToTop";

// Public archive-ported pages
import Index from "./pages/Index";
import ContactPage from "./pages/contact/ContactPage";
import FilmRestoration from "./pages/film-restoration/FilmRestoration";
import EquipmentPage from "./pages/equipment/EquipmentPage";
import SpecialRental from "./pages/services/special-rental/SpecialRental";
import Vr360 from "./pages/services/vr-360-3d/Vr360";
import AboutPage from "./pages/about/AboutPage";
import Production from "./pages/services/production/Production";
import PostProduction from "./pages/services/post-production/PostProduction";
import Prices from "./pages/services/prices/Prices";
import OurWorkPage from "./pages/OurWorkPage";
import NotFound from "./pages/NotFound";

// Admin (backend — kept intact)
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import EquipmentForm from "./pages/admin/EquipmentForm";
import RentalsManager from "./pages/admin/RentalsManager";
import MessagesPage from "./pages/admin/MessagesPage";
import WorksManager from "./pages/admin/WorksManager";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
            {/* Public archive pages */}
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/film-restoration" element={<FilmRestoration />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/special-rental" element={<SpecialRental />} />
            <Route path="/vr-360-3d" element={<Vr360 />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/production" element={<Production />} />
            <Route path="/post-production" element={<PostProduction />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/our-work" element={<OurWorkPage />} />

            {/* Admin auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin CMS (Protected) — all 4 backend services */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/equipment" element={<ProtectedRoute><EquipmentForm /></ProtectedRoute>} />
            <Route path="/admin/rentals" element={<ProtectedRoute><RentalsManager /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/admin/works" element={<ProtectedRoute><WorksManager /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
