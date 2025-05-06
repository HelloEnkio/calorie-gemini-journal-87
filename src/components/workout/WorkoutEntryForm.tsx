
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutEntry } from "@/types";
import { addWorkoutEntry } from "@/utils/storage";
import { generateId } from "@/utils/storage";
import { toast } from "sonner";
import { useProtectedAction } from "@/hooks/useProtectedAction";

interface WorkoutEntryFormProps {
  onAdd?: () => void;
}

const WORKOUT_TYPES = [
  "Cardio",
  "Musculation",
  "Course",
  "Natation",
  "Vélo",
  "Yoga",
  "Marche",
  "HIIT",
  "Autre"
];

const WorkoutEntryForm = ({ onAdd }: WorkoutEntryFormProps) => {
  const { protectAction } = useProtectedAction();
  const [workoutType, setWorkoutType] = useState(WORKOUT_TYPES[0]);
  const [duration, setDuration] = useState<string>("30");
  const [caloriesBurned, setCaloriesBurned] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  const handleSubmit = () => {
    if (!workoutType) {
      toast.error("Veuillez sélectionner un type d'entraînement");
      return;
    }
    
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      toast.error("Veuillez saisir une durée valide");
      return;
    }
    
    const newEntry: WorkoutEntry = {
      id: generateId(),
      name: workoutType, // Set name to workoutType to satisfy the type requirement
      type: workoutType,
      duration: Number(duration),
      timestamp: new Date().toISOString(),
    };
    
    if (caloriesBurned && !isNaN(Number(caloriesBurned))) {
      newEntry.caloriesBurned = Number(caloriesBurned);
    }
    
    if (notes.trim()) {
      newEntry.notes = notes.trim();
    }
    
    addWorkoutEntry(newEntry);
    toast.success("Séance d'entraînement ajoutée");
    
    // Reset form
    setWorkoutType(WORKOUT_TYPES[0]);
    setDuration("30");
    setCaloriesBurned("");
    setNotes("");
    
    if (onAdd) onAdd();
  };
  
  const handleProtectedSubmit = () => {
    protectAction(() => handleSubmit());
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ajouter une séance de sport</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="workout-type">Type d'entraînement</Label>
            <select 
              id="workout-type"
              className="w-full border border-input rounded-md h-10 px-3"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
            >
              {WORKOUT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories-burned">Calories brûlées (optionnel)</Label>
            <Input
              id="calories-burned"
              type="number"
              placeholder="Ex: 250"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Séance intense, poids soulevés..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <Button onClick={handleProtectedSubmit} className="w-full">
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkoutEntryForm;
