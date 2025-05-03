
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightEntry } from "@/types";
import { addWeightEntry } from "@/utils/storage";
import { generateId } from "@/utils/storage/core";
import { getTodaysLog } from "@/utils/storage/logs";
import { toast } from "sonner";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { ScaleIcon } from "lucide-react";

interface WeightEntryFormProps {
  onAdd?: () => void;
}

const WeightEntryForm = ({ onAdd }: WeightEntryFormProps) => {
  const { protectAction } = useProtectedAction();
  const todayLog = getTodaysLog();
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
    
    if (onAdd) onAdd();
  };

  const handleProtectedSubmit = () => {
    protectAction(() => handleSubmit());
  };
  
  return (
    <Card className="modern-card mb-4 overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-base flex items-center gap-2">
          <ScaleIcon className="h-5 w-5 text-primary" />
          Enregistrer votre poids
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Ex: 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="floating-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</Label>
            <Input
              id="notes"
              placeholder="Ex: Après le petit déjeuner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="floating-input"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleProtectedSubmit} 
          className="w-full modern-button"
        >
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeightEntryForm;
