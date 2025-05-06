
import { useState, useEffect } from "react";
import { format, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllLogs, getUserGoals } from "@/utils/storage";
import JournalDateNavigator from "@/components/journal/JournalDateNavigator";
import CaloriesTab from "@/components/journal/CaloriesTab";
import WeightTab from "@/components/journal/WeightTab";
import WorkoutTab from "@/components/journal/WorkoutTab";
import HabitsTab from "@/components/journal/HabitsTab";
import { DailyLog, UserGoals } from "@/types";

const Index = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dayLog, setDayLog] = useState<DailyLog | null>(null);
  const [goals, setGoals] = useState<UserGoals>({ dailyCalories: 2000 });
  const [activeTab, setActiveTab] = useState<string>("calories");
  
  const dateFormatted = format(currentDate, "EEEE d MMMM", { locale: fr });
  const isCurrentDateToday = isToday(currentDate);
  
  const navigateToDay = (date: Date) => {
    setCurrentDate(date);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const loadDayData = () => {
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    const logs = getAllLogs();
    const log = logs.find(l => l.date === formattedDate) || {
      date: formattedDate,
      totalCalories: 0,
      totalMacros: { protein: 0, carbs: 0, fat: 0 },
      foodEntries: [],
      workouts: [],
      habits: {}
    };
    
    setDayLog(log);
  };
  
  const loadGoals = () => {
    const userGoals = getUserGoals();
    setGoals(userGoals);
  };
  
  useEffect(() => {
    loadDayData();
    loadGoals();
  }, [currentDate]);
  
  if (!dayLog) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className="max-w-lg mx-auto px-4 pb-20">
      <JournalDateNavigator
        currentDate={currentDate}
        dateFormatted={dateFormatted}
        navigateToDay={navigateToDay}
        goToToday={goToToday}
        isToday={isCurrentDateToday}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="border-b flex justify-center overflow-x-auto -mx-4 px-4">
          <TabsList className="inline-flex h-9 p-1 text-muted-foreground">
            <TabsTrigger
              value="calories"
              className="h-8 rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Calories
            </TabsTrigger>
            <TabsTrigger
              value="weight"
              className="h-8 rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Poids
            </TabsTrigger>
            <TabsTrigger
              value="workout"
              className="h-8 rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Sport
            </TabsTrigger>
            <TabsTrigger
              value="habits"
              className="h-8 rounded-full px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Habitudes
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="calories" className="space-y-4">
          <CaloriesTab dayLog={dayLog} goals={goals} refreshData={loadDayData} />
        </TabsContent>
        
        <TabsContent value="weight" className="space-y-4">
          <WeightTab dayLog={dayLog} refreshData={loadDayData} />
        </TabsContent>
        
        <TabsContent value="workout" className="space-y-4">
          <WorkoutTab dayLog={dayLog} refreshData={loadDayData} />
        </TabsContent>
        
        <TabsContent value="habits" className="space-y-4">
          <HabitsTab dayLog={dayLog} refreshData={loadDayData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
