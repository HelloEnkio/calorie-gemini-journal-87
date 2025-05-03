
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
import { WeightEntry } from "@/types";
import { addWeightEntry, generateId, getTodaysLog } from "@/utils/storage";
import { toast } from "sonner";

interface WeightEntryFormProps {
  onAdd?: () => void;
}

const WeightEntryForm = ({ onAdd }: WeightEntryFormProps) => {
  const todayLog = getTodaysLog();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<string>(
    todayLog.weight ? todayLog.weight.weight.toString() : ""
  );
  const [notes, setNotes] = useState<string>("");
  
  const handleSubmit = () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      toast.error("Veuillez saisir un poids valide");
      return;
    }
    
    const newEntry: WeightEntry = {
      id: generateId(),
      weight: Number(weight),
      timestamp: new Date().toISOString(),
    };
    
    if (notes.trim()) {
      newEntry.notes = notes.trim();
    }
    
    addWeightEntry(newEntry);
    toast.success("Poids enregistré");
    
    // Reset form
    setWeight("");
    setNotes("");
    setOpen(false);
    
    if (onAdd) onAdd();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          + Enregistrer le poids
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer votre poids</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Ex: 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              placeholder="Ex: Après le petit déjeuner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={handleSubmit} className="w-full">
          Enregistrer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WeightEntryForm;
