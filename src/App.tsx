
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { initializeMockData, createMockWeightImages } from "./utils/mockData";
import { initializeMockAchievements } from "./utils/mockAchievements";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  // Initialize mock data on first load
  useEffect(() => {
    // Clear existing data to ensure our new dataset gets applied
    localStorage.removeItem('nutrition-tracker-daily-logs');
    localStorage.removeItem('nutrition-tracker-image-weight-photo-day-0.png');
    
    // Initialiser les données
    initializeMockData();
    
    // Créer les images factices (maintenant avec plus d'images)
    createMockWeightImages();
    
    // Initialiser les succès
    initializeMockAchievements();
    
    console.log("Mock data and images initialized successfully");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
