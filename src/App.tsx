
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AllFlowers from "./pages/AllFlowers";
import SpareFlowers from "./pages/SpareFlowers";
import TiedFlowers from "./pages/TiedFlowers";
import FlowerGarlands from "./pages/FlowerGarlands";
import SeasonalFlowers from "./pages/SeasonalFlowers";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PaymentProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/all-flowers" element={
                <ProtectedRoute>
                  <AllFlowers />
                </ProtectedRoute>
              } />
              <Route path="/spare-flowers" element={
                <ProtectedRoute>
                  <SpareFlowers />
                </ProtectedRoute>
              } />
              <Route path="/tied-flowers" element={
                <ProtectedRoute>
                  <TiedFlowers />
                </ProtectedRoute>
              } />
              <Route path="/flower-garlands" element={
                <ProtectedRoute>
                  <FlowerGarlands />
                </ProtectedRoute>
              } />
              <Route path="/seasonal-flowers" element={
                <ProtectedRoute>
                  <SeasonalFlowers />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PaymentProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
