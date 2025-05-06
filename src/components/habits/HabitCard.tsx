
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Habit, HabitEntry } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  habitEntry?: HabitEntry;
  onComplete: (habitId: string) => void;
  onUncomplete: (habitId: string) => void;
}

const HabitCard = ({ habit, habitEntry, onComplete, onUncomplete }: HabitCardProps) => {
  const isCompleted = !!habitEntry?.completed;
  
  const handleToggle = () => {
    if (isCompleted) {
      onUncomplete(habit.id);
      toast.info(`"${habit.name}" marqué comme non terminé`);
    } else {
      onComplete(habit.id);
      toast.success(`"${habit.name}" validé !`);
    }
  };
  
  // Calculer le style en fonction de la couleur d'habitude
  const getCardStyles = () => {
    if (!habit.color) return {};
    
    // Créer un style avec une bordure plus foncée et un fond léger
    return {
      borderColor: isCompleted ? habit.color : undefined,
      backgroundColor: isCompleted ? `${habit.color}10` : undefined,
    };
  };
  
  return (
    <Card 
      className={cn(
        "mb-3 transition-all duration-300",
        isCompleted ? "border-2" : ""
      )} 
      style={getCardStyles()}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{habit.icon || '✅'}</div>
            <div>
              <div className="font-medium">{habit.name}</div>
              {habit.description && (
                <div className="text-sm text-muted-foreground">{habit.description}</div>
              )}
              {habit.streak && habit.streak > 0 && (
                <Badge 
                  variant="outline" 
                  className="mt-1 bg-orange-50 border-orange-200 text-orange-700"
                >
                  🔥 Streak: {habit.streak} jour{habit.streak > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            className={cn(
              isCompleted ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "",
              "min-w-24"
            )}
            onClick={handleToggle}
          >
            {isCompleted ? (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Annuler
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Valider
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
