
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FoodEntry, MacroNutrients } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditFoodEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: FoodEntry | null;
  onSave: (updatedEntry: FoodEntry) => void;
}

const EditFoodEntryModal = ({ isOpen, onClose, entry, onSave }: EditFoodEntryModalProps) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  // Initialiser le formulaire avec les valeurs de l'entrée existante
  useEffect(() => {
    if (entry) {
      setName(entry.name);
      setCalories(entry.calories.toString());
      setProtein(entry.macros.protein.toString());
      setCarbs(entry.macros.carbs.toString());
      setFat(entry.macros.fat.toString());
      setWeight(entry.weight?.toString() || "");
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entry) return;
    
    if (!name.trim()) {
      toast.error("Veuillez saisir un nom d'aliment");
      return;
    }
    
    if (!calories || isNaN(Number(calories)) || Number(calories) <= 0) {
      toast.error("Veuillez saisir un nombre de calories valide");
      return;
    }
    
    const macros: MacroNutrients = {
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0
    };
    
    const updatedEntry: FoodEntry = {
      ...entry,
      name,
      calories: Number(calories),
      macros,
      weight: weight ? Number(weight) : undefined,
    };
    
    onSave(updatedEntry);
    onClose();
    toast.success("Repas modifié avec succès");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le repas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom du repas</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-calories">Calories (kcal)</Label>
              <Input
                id="edit-calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-weight">Quantité (g)</Label>
              <Input
                id="edit-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-protein">Protéines (g)</Label>
              <Input
                id="edit-protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-carbs">Glucides (g)</Label>
              <Input
                id="edit-carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fat">Lipides (g)</Label>
              <Input
                id="edit-fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodEntryModal;
