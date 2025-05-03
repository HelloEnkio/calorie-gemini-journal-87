
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, addDays, subDays, isToday } from "date-fns";
import { fr } from "date-fns/locale"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { getLogForDate, getUserGoals, checkAndUpdateAchievements, formatDateKey } from "@/utils/storage";
import { Calendar } from "lucide-react";
import CaloriesTab from "@/components/journal/CaloriesTab";
import WeightTab from "@/components/journal/WeightTab";
import WorkoutTab from "@/components/journal/WorkoutTab";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayLog, setDayLog] = useState(getLogForDate(formatDateKey(currentDate)));
  const [goals, setGoals] = useState(getUserGoals());
  const [activeSubTab, setActiveSubTab] = useState("calories");
  
  // Refresh data
  const refreshData = () => {
    setDayLog(getLogForDate(formatDateKey(currentDate)));
    checkAndUpdateAchievements();
  };
  
  // Navigate to a different day
  const navigateToDay = (date: Date) => {
    setCurrentDate(date);
    setDayLog(getLogForDate(formatDateKey(date)));
  };
  
  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setDayLog(getLogForDate(formatDateKey(today)));
  };
  
  // Format the date for display
  const dateFormatted = format(currentDate, "EEEE d MMMM", { locale: fr });
  
  useEffect(() => {
    // Check achievements when the page loads
    checkAndUpdateAchievements();
  }, []);
  
  return (
    <div className="mobile-container pt-4 pb-20">
      {/* Day navigation */}
      <div className="mb-4">
        <Carousel className="w-full">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Journal nutritionnel</h1>
            {!isToday(currentDate) && (
              <Button variant="outline" size="sm" onClick={goToToday} className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Aujourd'hui</span>
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <CarouselPrevious onClick={() => navigateToDay(subDays(currentDate, 1))} className="relative translate-y-0 left-0" />
            <p className="text-center text-muted-foreground capitalize">{dateFormatted}</p>
            <CarouselNext onClick={() => navigateToDay(addDays(currentDate, 1))} className="relative translate-y-0 right-0" />
          </div>
        </Carousel>
      </div>
      
      {/* Journal Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
          <TabsTrigger value="workout">Sport</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calories">
          <CaloriesTab 
            dayLog={dayLog} 
            goals={goals} 
            refreshData={refreshData} 
          />
        </TabsContent>
        
        <TabsContent value="weight">
          <WeightTab 
            dayLog={dayLog} 
            refreshData={refreshData} 
          />
        </TabsContent>
        
        <TabsContent value="workout">
          <WorkoutTab 
            dayLog={dayLog} 
            refreshData={refreshData} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
