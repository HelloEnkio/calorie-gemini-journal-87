
import { useState, useEffect } from "react";
import { isToday, format, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale"; 
import { formatDateKey, getLogForDate, getUserGoals, checkAndUpdateAchievements } from "@/utils/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CaloriesTab from "@/components/journal/CaloriesTab";
import WeightTab from "@/components/journal/WeightTab";
import WorkoutTab from "@/components/journal/WorkoutTab";
import JournalDateNavigator from "@/components/journal/JournalDateNavigator";

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
    <div className="mobile-container pt-6 pb-20">
      {/* Day navigation */}
      <JournalDateNavigator 
        currentDate={currentDate} 
        dateFormatted={dateFormatted} 
        navigateToDay={navigateToDay}
        goToToday={goToToday}
        isToday={isToday(currentDate)}
      />
      
      {/* Journal Sub-tabs */}
      <Tabs defaultValue={activeSubTab} value={activeSubTab} onValueChange={setActiveSubTab} className="mb-6 mt-4">
        <TabsList className="grid grid-cols-3 mb-6 rounded-xl bg-muted/70 p-1">
          <TabsTrigger value="calories" className="rounded-lg data-[state=active]:shadow-sm">Calories</TabsTrigger>
          <TabsTrigger value="weight" className="rounded-lg data-[state=active]:shadow-sm">Poids</TabsTrigger>
          <TabsTrigger value="workout" className="rounded-lg data-[state=active]:shadow-sm">Sport</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calories" className="tab-content">
          <CaloriesTab 
            dayLog={dayLog} 
            goals={goals} 
            refreshData={refreshData} 
          />
        </TabsContent>
        
        <TabsContent value="weight" className="tab-content">
          <WeightTab 
            dayLog={dayLog} 
            refreshData={refreshData} 
          />
        </TabsContent>
        
        <TabsContent value="workout" className="tab-content">
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
