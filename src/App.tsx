import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placements from "./pages/Placements";
import Departments from "./pages/Departments";
import DepartmentDetail from './pages/DepartmentDetail';
import CampusLife from "./pages/CampusLife";
import AboutUs from "./pages/AboutUs";
import News from "./pages/News";
import Academics from './pages/Academics';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import NewsManager from './pages/admin/NewsManager';
import DepartmentManager from './pages/admin/DepartmentManager';
import AcademicsManager from './pages/admin/AcademicsManager';
import PlacementsManager from './pages/admin/PlacementsManager';
import ProtectedRoute from './components/ProtectedRoute';
import DataMigration from './pages/DataMigration';
import AnimationProvider from './components/AnimationProvider';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AnimationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/placements" element={<Placements />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/:id" element={<DepartmentDetail />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/campus-life" element={<CampusLife />} />
              <Route path="/about-us" element={<AboutUs />} />

              {/* Admin Routes */}
              <Route path="/only-access-to-admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
                <Route path="news" element={<NewsManager />} />
                <Route path="departments" element={<DepartmentManager />} />
                <Route path="academics" element={<AcademicsManager />} />
                <Route path="placements" element={<PlacementsManager />} />
              </Route>

              {/* Data Migration Route (one-time use) */}
              <Route path="/migrate-data" element={<DataMigration />} />

              {/* Placeholder routes */}
              <Route path="/study-with-us" element={<NotFound />} />
              <Route path="/research" element={<NotFound />} />
              <Route path="/iqac" element={<NotFound />} />
              <Route path="/events" element={<NotFound />} />
              <Route path="/admissions" element={<NotFound />} />
              <Route path="/programs" element={<NotFound />} />

              {/* Campus Life subpages */}
              <Route path="/campus-life/clubs" element={<NotFound />} />
              <Route path="/campus-life/events" element={<NotFound />} />
              <Route path="/campus-life/sports" element={<NotFound />} />
              <Route path="/campus-life/accommodation" element={<NotFound />} />
              <Route path="/campus-life/dining" element={<NotFound />} />
              <Route path="/campus-life/transportation" element={<NotFound />} />
              <Route path="/campus-life/infrastructure" element={<NotFound />} />
              <Route path="/campus-life/green-initiatives" element={<NotFound />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AnimationProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
