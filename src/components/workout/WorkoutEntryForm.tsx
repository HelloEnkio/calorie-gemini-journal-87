
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { WorkoutEntry } from "@/types";
import { addWorkoutEntry, generateId } from "@/utils/storage";
import { toast } from "sonner";

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
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    
    if (onAdd) onAdd();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          + Ajouter séance de sport
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une séance</DialogTitle>
        </DialogHeader>
        
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
        
        <Button onClick={handleSubmit} className="w-full">
          Ajouter
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutEntryForm;
