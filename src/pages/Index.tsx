
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, addDays, subDays, isToday } from "date-fns";
import FoodEntry from "@/components/food/FoodEntry";
import QuickAddForm from "@/components/food/QuickAddForm";
import GeminiInputForm from "@/components/food/GeminiInputForm";
import WorkoutEntryForm from "@/components/workout/WorkoutEntryForm";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { getLogForDate, getUserGoals, checkAndUpdateAchievements, formatDateKey } from "@/utils/storage";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayLog, setDayLog] = useState(getLogForDate(formatDateKey(currentDate)));
  const [goals, setGoals] = useState(getUserGoals());
  const [showWorkoutSection, setShowWorkoutSection] = useState(false);
  
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
  
  // Calculate percentage of goal
  const caloriePercentage = Math.min(
    Math.round((dayLog.totalCalories / goals.dailyCalories) * 100),
    100
  );
  
  // Format macros as percentages
  const getTotalMacrosPercentage = () => {
    const { protein, carbs, fat } = dayLog.totalMacros;
    const total = protein + carbs + fat;
    
    if (total === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }
    
    return {
      protein: Math.round((protein / total) * 100),
      carbs: Math.round((carbs / total) * 100),
      fat: Math.round((fat / total) * 100),
    };
  };
  
  const macroPercentages = getTotalMacrosPercentage();
  
  // Format the date for display
  const dateFormatted = format(currentDate, "EEEE d MMMM", { locale: require('date-fns/locale/fr') });
  
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
      
      {/* Calories summary card */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-medium">Calories</h2>
              <p className="text-muted-foreground text-sm">
                Objectif: {goals.dailyCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{dayLog.totalCalories}</span>
              <span className="text-sm ml-1">kcal</span>
            </div>
          </div>
          
          <Progress value={caloriePercentage} className="h-2 mb-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{caloriePercentage}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Macro breakdown */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Macronutriments</h2>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-100 text-green-800 p-3 rounded-lg">
            <div className="font-medium">Protéines</div>
            <div className="text-xl font-bold">{dayLog.totalMacros.protein}g</div>
            <div className="text-xs">{macroPercentages.protein}%</div>
          </div>
          
          <div className="bg-amber-100 text-amber-800 p-3 rounded-lg">
            <div className="font-medium">Glucides</div>
            <div className="text-xl font-bold">{dayLog.totalMacros.carbs}g</div>
            <div className="text-xs">{macroPercentages.carbs}%</div>
          </div>
          
          <div className="bg-rose-100 text-rose-800 p-3 rounded-lg">
            <div className="font-medium">Lipides</div>
            <div className="text-xl font-bold">{dayLog.totalMacros.fat}g</div>
            <div className="text-xs">{macroPercentages.fat}%</div>
          </div>
        </div>
      </div>
      
      {/* Food entries */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Repas</h2>
          
          <Badge variant="outline">
            {dayLog.foodEntries.length} {dayLog.foodEntries.length > 1 ? 'repas' : 'repas'}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <GeminiInputForm onAdd={refreshData} />
          <QuickAddForm onAdd={refreshData} />
        </div>
        
        <Separator className="my-4" />
        
        {dayLog.foodEntries.length > 0 ? (
          <div className="space-y-3">
            {dayLog.foodEntries.map((entry) => (
              <FoodEntry key={entry.id} entry={entry} onDelete={refreshData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun repas enregistré ce jour</p>
            <p className="text-sm">Utilisez le formulaire ci-dessus pour ajouter des repas</p>
          </div>
        )}
      </div>
      
      {/* Workout & Weight sections */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => setShowWorkoutSection(!showWorkoutSection)}
          className="w-full flex items-center justify-between mb-2"
        >
          <span className="font-medium">Exercices & Poids</span>
          {showWorkoutSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        
        {showWorkoutSection && (
          <div className="space-y-4 mt-4">
            <WorkoutEntryForm onAdd={refreshData} />
            <WeightEntryForm onAdd={refreshData} />
            
            <div className="mt-4">
              {dayLog.workouts.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Séances du jour:</h3>
                  {dayLog.workouts.map((workout) => (
                    <div key={workout.id} className="bg-muted p-3 rounded mb-2">
                      <div className="font-medium">{workout.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {workout.duration} min
                        {workout.caloriesBurned ? ` • ${workout.caloriesBurned} kcal` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {dayLog.weight && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Poids du jour:</h3>
                  <div className="bg-muted p-3 rounded">
                    <div className="font-medium">{dayLog.weight.weight} kg</div>
                    {dayLog.weight.notes && (
                      <div className="text-sm text-muted-foreground">{dayLog.weight.notes}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
