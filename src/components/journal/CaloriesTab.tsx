
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import FoodEntry from "@/components/food/FoodEntry";
import QuickAddForm from "@/components/food/QuickAddForm";
import GeminiInputForm from "@/components/food/GeminiInputForm";
import { DailyLog, UserGoals } from "@/types";

interface CaloriesTabProps {
  dayLog: DailyLog;
  goals: UserGoals;
  refreshData: () => void;
}

const CaloriesTab = ({ dayLog, goals, refreshData }: CaloriesTabProps) => {
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
  
  return (
    <>
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
      <div>
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
    </>
  );
};

export default CaloriesTab;
