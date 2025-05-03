
import { Card, CardContent } from "@/components/ui/card";
import WorkoutEntryForm from "@/components/workout/WorkoutEntryForm";
import { DailyLog } from "@/types";

interface WorkoutTabProps {
  dayLog: DailyLog;
  refreshData: () => void;
}

const WorkoutTab = ({ dayLog, refreshData }: WorkoutTabProps) => {
  // Calculate total workout duration and calories burned
  const totalDuration = dayLog.workouts.reduce((total, workout) => total + workout.duration, 0);
  const totalCaloriesBurned = dayLog.workouts.reduce(
    (total, workout) => total + (workout.caloriesBurned || 0), 
    0
  );
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Activités sportives</h2>
      
      <WorkoutEntryForm onAdd={refreshData} />
      
      {dayLog.workouts.length > 0 && (
        <div className="mt-4 space-y-4">
          {/* Summary card */}
          {(totalDuration > 0 || totalCaloriesBurned > 0) && (
            <Card className="mb-2">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Durée totale</div>
                    <div className="text-2xl font-bold">{totalDuration} min</div>
                  </div>
                  {totalCaloriesBurned > 0 && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Calories brûlées</div>
                      <div className="text-2xl font-bold">{totalCaloriesBurned}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <h3 className="text-sm font-medium mb-2">Séances du jour</h3>
          {dayLog.workouts.map((workout) => (
            <Card key={workout.id} className="mb-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{workout.type}</h4>
                    <div className="text-sm text-muted-foreground">
                      {workout.duration} min
                      {workout.caloriesBurned ? ` • ${workout.caloriesBurned} kcal` : ''}
                    </div>
                    {workout.notes && (
                      <div className="text-sm mt-2">{workout.notes}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {dayLog.workouts.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p>Aucune activité sportive enregistrée ce jour</p>
          <p className="text-sm">Utilisez le formulaire ci-dessus pour ajouter une activité</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTab;
