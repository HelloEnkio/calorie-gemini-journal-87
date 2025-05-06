
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllLogs, getUserGoals } from "@/utils/storage";
import JournalDateNavigator from "@/components/journal/JournalDateNavigator";
import CaloriesTab from "@/components/journal/CaloriesTab";
import WorkoutTab from "@/components/journal/WorkoutTab";
import HabitsTab from "@/components/journal/HabitsTab";
import WeightTab from "@/components/journal/WeightTab";
import { CalendarIcon } from "lucide-react";

const Index = () => {
  const [date, setDate] = useState<Date>(new Date());
  // Initialize with an empty array to prevent errors
  const [dailyLogs, setDailyLogs] = useState<Array<any>>([]);
  const [userGoals, setUserGoals] = useState(() => getUserGoals());
  
  // Update dailyLogs when date changes
  useEffect(() => {
    // Ensure getAllLogs returns an array
    const logs = getAllLogs();
    setDailyLogs(Array.isArray(logs) ? logs : []);
    setUserGoals(getUserGoals());
  }, [date]);
  
  const formattedDate = format(date, "yyyy-MM-dd");
  const dateFormatted = format(date, "EEEE d MMMM yyyy", { locale: fr });
  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  
  // Find the log for the current date - ensure dailyLogs is an array first
  const dailyLog = Array.isArray(dailyLogs) 
    ? dailyLogs.find((log) => log.date === formattedDate)
    : undefined;
  
  // Function to handle date navigation
  const navigateToDay = (newDate: Date) => {
    setDate(newDate);
  };
  
  // Function to go to today
  const goToToday = () => {
    setDate(new Date());
  };
  
  // Function to refresh data
  const refreshData = () => {
    const logs = getAllLogs();
    setDailyLogs(Array.isArray(logs) ? logs : []);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner une date</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <JournalDateNavigator
              currentDate={date}
              dateFormatted={dateFormatted}
              navigateToDay={navigateToDay}
              goToToday={goToToday}
              isToday={isToday}
              date={date}
              onDateChange={(newDate: Date) => {
                setDate(newDate);
              }}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={fr}
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2024-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>
      
      <QuickAddForm onAdd={refreshData} />
      
      <Tabs defaultValue="calories" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="workout">Entraînement</TabsTrigger>
          <TabsTrigger value="habits">Habitudes</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
        </TabsList>
        <TabsContent value="calories">
          <CaloriesTab dayLog={dailyLog} goals={userGoals} refreshData={refreshData} />
        </TabsContent>
        <TabsContent value="workout">
          <WorkoutTab dayLog={dailyLog} refreshData={refreshData} />
        </TabsContent>
        <TabsContent value="habits">
          <HabitsTab 
            dayLog={dailyLog || {
              date: formattedDate,
              totalCalories: 0,
              totalMacros: { protein: 0, carbs: 0, fat: 0 },
              foodEntries: [],
              workouts: []
            }} 
            refreshData={refreshData} 
            currentDate={date}
          />
        </TabsContent>
        <TabsContent value="weight">
          <WeightTab dayLog={dailyLog} refreshData={refreshData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

// Import QuickAddForm component
import QuickAddForm from "@/components/food/QuickAddForm";
