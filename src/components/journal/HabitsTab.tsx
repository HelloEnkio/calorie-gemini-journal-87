
import { useState, useEffect } from "react";
import { Habit, DailyLog } from "@/types";
import { getAllHabits, completeHabit, uncompleteHabit } from "@/utils/habitsStorage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import HabitCard from "@/components/habits/HabitCard";

interface HabitsTabProps {
  dayLog: DailyLog;
  refreshData: () => void;
}

const HabitsTab = ({ dayLog, refreshData }: HabitsTabProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Charger les habitudes actives
    const allHabits = getAllHabits();
    setHabits(allHabits.filter(habit => habit.active));
  }, [dayLog]);

  const handleComplete = (habitId: string) => {
    completeHabit(habitId, new Date(dayLog.date));
    refreshData();
  };

  const handleUncomplete = (habitId: string) => {
    uncompleteHabit(habitId, new Date(dayLog.date));
    refreshData();
  };

  // Calcul du pourcentage d'habitudes terminées
  const completedCount = Object.values(dayLog.habits || {}).filter(entry => entry.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Habitudes</h2>

      {/* Progress summary */}
      {totalCount > 0 && (
        <Card className={cn(
          "mb-6",
          allCompleted ? "border-2 border-primary bg-primary/5" : ""
        )}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Progression du jour</h3>
                <div className="text-sm text-muted-foreground">
                  {completedCount} sur {totalCount} habitude{totalCount > 1 ? 's' : ''} terminée{completedCount > 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-3xl font-bold">
                {completionPercentage}%
                {allCompleted && <Trophy className="inline ml-2 text-primary h-6 w-6" />}
              </div>
            </div>
            
            <div className="mt-2 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full",
                  allCompleted ? "bg-primary" : "bg-blue-500"
                )}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habits list */}
      <div className="space-y-4">
        {habits.length > 0 ? (
          <div>
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                habitEntry={dayLog.habits?.[habit.id]}
                onComplete={handleComplete}
                onUncomplete={handleUncomplete}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Aucune habitude n'est configurée.
              </p>
              <Button variant="outline" className="mx-auto">
                <Plus className="h-4 w-4 mr-1" />
                Configurer des habitudes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HabitsTab;
