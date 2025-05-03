
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FoodEntry from "@/components/food/FoodEntry";
import QuickAddForm from "@/components/food/QuickAddForm";
import GeminiInputForm from "@/components/food/GeminiInputForm";
import WorkoutEntryForm from "@/components/workout/WorkoutEntryForm";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import { getTodaysLog, getUserGoals, checkAndUpdateAchievements } from "@/utils/storage";
import { ChevronDown, ChevronUp } from "lucide-react";

const Index = () => {
  const [todayLog, setTodayLog] = useState(getTodaysLog());
  const [goals, setGoals] = useState(getUserGoals());
  const [showWorkoutSection, setShowWorkoutSection] = useState(false);
  
  // Refresh data
  const refreshData = () => {
    setTodayLog(getTodaysLog());
    checkAndUpdateAchievements();
  };
  
  // Calculate percentage of goal
  const caloriePercentage = Math.min(
    Math.round((todayLog.totalCalories / goals.dailyCalories) * 100),
    100
  );
  
  // Format macros as percentages
  const getTotalMacrosPercentage = () => {
    const { protein, carbs, fat } = todayLog.totalMacros;
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
  
  useEffect(() => {
    // Check achievements when the page loads
    checkAndUpdateAchievements();
  }, []);
  
  return (
    <div className="mobile-container pt-4 pb-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Journal nutritionnel</h1>
        <p className="text-muted-foreground">Aujourd'hui</p>
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
              <span className="text-2xl font-bold">{todayLog.totalCalories}</span>
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
            <div className="text-xl font-bold">{todayLog.totalMacros.protein}g</div>
            <div className="text-xs">{macroPercentages.protein}%</div>
          </div>
          
          <div className="bg-amber-100 text-amber-800 p-3 rounded-lg">
            <div className="font-medium">Glucides</div>
            <div className="text-xl font-bold">{todayLog.totalMacros.carbs}g</div>
            <div className="text-xs">{macroPercentages.carbs}%</div>
          </div>
          
          <div className="bg-rose-100 text-rose-800 p-3 rounded-lg">
            <div className="font-medium">Lipides</div>
            <div className="text-xl font-bold">{todayLog.totalMacros.fat}g</div>
            <div className="text-xs">{macroPercentages.fat}%</div>
          </div>
        </div>
      </div>
      
      {/* Food entries */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Repas</h2>
          
          <Badge variant="outline">
            {todayLog.foodEntries.length} {todayLog.foodEntries.length > 1 ? 'repas' : 'repas'}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <GeminiInputForm onAdd={refreshData} />
          <QuickAddForm onAdd={refreshData} />
        </div>
        
        <Separator className="my-4" />
        
        {todayLog.foodEntries.length > 0 ? (
          <div className="space-y-3">
            {todayLog.foodEntries.map((entry) => (
              <FoodEntry key={entry.id} entry={entry} onDelete={refreshData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun repas enregistré aujourd'hui</p>
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
              {todayLog.workouts.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Séances d'aujourd'hui:</h3>
                  {todayLog.workouts.map((workout) => (
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
              
              {todayLog.weight && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Poids d'aujourd'hui:</h3>
                  <div className="bg-muted p-3 rounded">
                    <div className="font-medium">{todayLog.weight.weight} kg</div>
                    {todayLog.weight.notes && (
                      <div className="text-sm text-muted-foreground">{todayLog.weight.notes}</div>
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
