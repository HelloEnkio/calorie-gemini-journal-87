
import { DailyLog } from "@/types";
import { Separator } from "@/components/ui/separator";

interface StatsSummaryProps {
  logs: DailyLog[];
  weightChange: string | null;
}

interface SummaryData {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  totalWorkouts: number;
  daysTracked: number;
}

const StatsSummary = ({ logs, weightChange }: StatsSummaryProps) => {
  // Calculate summary statistics
  const calculateSummary = (): SummaryData => {
    if (logs.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        totalWorkouts: 0,
        daysTracked: 0
      };
    }
    
    const totals = logs.reduce((acc, log) => {
      return {
        calories: acc.calories + log.totalCalories,
        protein: acc.protein + log.totalMacros.protein,
        carbs: acc.carbs + log.totalMacros.carbs,
        fat: acc.fat + log.totalMacros.fat,
        workouts: acc.workouts + log.workouts.length
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, workouts: 0 });
    
    return {
      avgCalories: Math.round(totals.calories / logs.length),
      avgProtein: Math.round(totals.protein / logs.length),
      avgCarbs: Math.round(totals.carbs / logs.length),
      avgFat: Math.round(totals.fat / logs.length),
      totalWorkouts: totals.workouts,
      daysTracked: logs.length
    };
  };
  
  const summary = calculateSummary();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-sm text-muted-foreground">Calories moy.</div>
          <div className="text-xl font-bold">{summary.avgCalories}</div>
          <div className="text-xs">kcal/jour</div>
        </div>
        
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-sm text-muted-foreground">Séances sport</div>
          <div className="text-xl font-bold">{summary.totalWorkouts}</div>
          <div className="text-xs">séance{summary.totalWorkouts !== 1 && 's'}</div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Macros moyennes</h3>
        <div className="flex space-x-2 text-sm">
          <div className="flex-1 bg-green-100 text-green-800 p-2 rounded text-center">
            <div>Protéines</div>
            <div className="font-bold">{summary.avgProtein}g</div>
          </div>
          <div className="flex-1 bg-amber-100 text-amber-800 p-2 rounded text-center">
            <div>Glucides</div>
            <div className="font-bold">{summary.avgCarbs}g</div>
          </div>
          <div className="flex-1 bg-rose-100 text-rose-800 p-2 rounded text-center">
            <div>Lipides</div>
            <div className="font-bold">{summary.avgFat}g</div>
          </div>
        </div>
      
        {weightChange && (
          <div>
            <Separator className="my-3" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Evolution du poids</div>
              <div className={`text-xl font-bold ${
                Number(weightChange) > 0 
                  ? 'text-rose-500'
                  : Number(weightChange) < 0
                    ? 'text-emerald-500'
                    : ''
              }`}>
                {Number(weightChange) > 0 ? '+' : ''}{weightChange} kg
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsSummary;
