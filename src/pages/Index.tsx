
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FoodEntry from "@/components/food/FoodEntry";
import QuickAddForm from "@/components/food/QuickAddForm";
import { format, addDays, subDays, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllLogs, getUserGoals } from "@/utils/storage";
import JournalDateNavigator from "@/components/journal/JournalDateNavigator";
import CaloriesTab from "@/components/journal/CaloriesTab";
import WorkoutTab from "@/components/journal/WorkoutTab";
import HabitsTab from "@/components/journal/HabitsTab";
import WeightTab from "@/components/journal/WeightTab";

const Index = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [dailyLogs, setDailyLogs] = useState(() => getAllLogs());
  const [userGoals, setUserGoals] = useState(() => getUserGoals());
  
  // Update dailyLogs when date changes
  useEffect(() => {
    setDailyLogs(getAllLogs());
    setUserGoals(getUserGoals());
  }, [date]);
  
  const formattedDate = format(date, "yyyy-MM-dd");
  
  // Find the log for the current date
  const dailyLog = dailyLogs.find((log) => log.date === formattedDate);
  
  // Function to handle date navigation
  const navigateToDate = (newDate: Date) => {
    setDate(newDate);
  };
  
  // Function to refresh data
  const refreshData = () => {
    setDailyLogs(getAllLogs());
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
              onPrevious={() => navigateToDate(subDays(date, 1))}
              onNext={() => navigateToDate(addDays(date, 1))}
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
                  onSelect={setDate}
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
          <WorkoutTab currentDate={date} dayLog={dailyLog} onRefresh={refreshData} />
        </TabsContent>
        <TabsContent value="habits">
          <HabitsTab currentDate={date} dayLog={dailyLog} onRefresh={refreshData} />
        </TabsContent>
        <TabsContent value="weight">
          <WeightTab currentDate={date} dayLog={dailyLog} onRefresh={refreshData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

import { CalendarIcon } from "lucide-react";
