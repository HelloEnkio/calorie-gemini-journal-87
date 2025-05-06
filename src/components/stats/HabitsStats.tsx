
import { useState, useEffect } from "react";
import { Habit, HabitStats as HabitStatsType } from "@/types";
import { getAllHabits, getHabitStats } from "@/utils/habitsStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitProgressProps {
  percentage: number;
  label: string;
  timeframe: string;
}

const HabitProgress = ({ percentage, label, timeframe }: HabitProgressProps) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <Progress 
      value={percentage} 
      className={cn("h-1.5", 
        percentage >= 80 ? "bg-slate-100" : "bg-slate-100"
      )}
    />
    <div className="text-xs text-muted-foreground">{timeframe}</div>
  </div>
);

interface HabitsStatsProps {
  logs: Array<any>;
}

const HabitsStats = ({ logs }: HabitsStatsProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsStats, setHabitsStats] = useState<Record<string, HabitStatsType>>({});
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  useEffect(() => {
    const allHabits = getAllHabits();
    const activeHabits = allHabits.filter(habit => habit.active);
    setHabits(activeHabits);
    
    if (activeHabits.length > 0 && !selectedHabit) {
      setSelectedHabit(activeHabits[0].id);
    }
    
    // Charger les stats pour chaque habitude
    const statsMap: Record<string, HabitStatsType> = {};
    activeHabits.forEach(habit => {
      const stats = getHabitStats(habit.id);
      if (stats) {
        statsMap[habit.id] = stats;
      }
    });
    
    setHabitsStats(statsMap);
  }, [logs, selectedHabit]);

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Aucune habitude active n'est configurée.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedStats = selectedHabit ? habitsStats[selectedHabit] : null;
  const selectedHabitData = selectedHabit ? habits.find(h => h.id === selectedHabit) : null;

  return (
    <div className="space-y-6">
      <Tabs 
        value={selectedHabit || ""} 
        onValueChange={setSelectedHabit}
        className="w-full"
      >
        <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(habits.length, 4)}, 1fr)` }}>
          {habits.slice(0, 4).map(habit => (
            <TabsTrigger key={habit.id} value={habit.id} className="flex items-center gap-1">
              <span>{habit.icon || "✅"}</span>
              <span className="hidden sm:inline truncate">{habit.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {habits.map(habit => (
          <TabsContent key={habit.id} value={habit.id}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    <span className="mr-2">{habit.icon || "✅"}</span>
                    {habit.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {habitsStats[habit.id] && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={cn(
                        "p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800",
                        habitsStats[habit.id].streak > 5 && "bg-green-50 border-green-100 text-green-800"
                      )}>
                        <div className="flex items-center gap-2">
                          <Flame className="h-5 w-5" />
                          <span className="text-sm font-medium">Série actuelle</span>
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {habitsStats[habit.id].streak} jour{habitsStats[habit.id].streak !== 1 ? "s" : ""}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 text-amber-800">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          <span className="text-sm font-medium">Record</span>
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {habitsStats[habit.id].longestStreak} jour{habitsStats[habit.id].longestStreak !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Taux de réussite</h3>
                      
                      <div className="space-y-4">
                        <HabitProgress 
                          percentage={habitsStats[habit.id].completionRates.week} 
                          label="Cette semaine" 
                          timeframe="7 derniers jours" 
                        />
                        
                        <HabitProgress 
                          percentage={habitsStats[habit.id].completionRates.month} 
                          label="Ce mois" 
                          timeframe="30 derniers jours" 
                        />
                        
                        <HabitProgress 
                          percentage={habitsStats[habit.id].completionRates.threeMonths} 
                          label="Trimestre" 
                          timeframe="90 derniers jours" 
                        />
                        
                        <HabitProgress 
                          percentage={habitsStats[habit.id].completionRates.year} 
                          label="Année" 
                          timeframe="365 derniers jours" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HabitsStats;
