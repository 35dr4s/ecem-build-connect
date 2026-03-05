import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const RentalDashboard = lazy(() => import("./pages/admin/RentalDashboard"));
const ServicesDashboard = lazy(() => import("./pages/admin/ServicesDashboard"));
const FinancialDashboard = lazy(() => import("./pages/admin/FinancialDashboard"));
const LeadsDashboard = lazy(() => import("./pages/admin/LeadsDashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<RentalDashboard />} />
              <Route path="servicos" element={<ServicesDashboard />} />
              <Route path="leads" element={<LeadsDashboard />} />
              <Route path="financeiro" element={<FinancialDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
