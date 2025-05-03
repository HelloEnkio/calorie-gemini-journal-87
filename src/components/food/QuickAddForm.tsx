
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
import { FoodEntry, MacroNutrients } from "@/types";
import { addFoodEntry, generateId } from "@/utils/storage";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuickAddFormProps {
  onAdd?: () => void;
}

const QuickAddForm = ({ onAdd }: QuickAddFormProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("simple");
  
  // Simple form
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<string>("");
  
  // Advanced form
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  
  const handleSubmit = () => {
    if (!foodName.trim()) {
      toast.error("Veuillez saisir un nom d'aliment");
      return;
    }
    
    if (!calories || isNaN(Number(calories)) || Number(calories) <= 0) {
      toast.error("Veuillez saisir un nombre de calories valide");
      return;
    }
    
    let macros: MacroNutrients;
    
    if (activeTab === "advanced") {
      // If advanced, use the entered values
      if (!protein || !carbs || !fat || 
          isNaN(Number(protein)) || isNaN(Number(carbs)) || isNaN(Number(fat))) {
        toast.error("Veuillez saisir des valeurs numériques pour les macronutriments");
        return;
      }
      
      macros = {
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat)
      };
    } else {
      // If simple, estimate macros based on calories
      const caloriesNum = Number(calories);
      macros = {
        protein: Math.round(caloriesNum * 0.25 / 4), // 25% from protein (4 cal/g)
        carbs: Math.round(caloriesNum * 0.45 / 4),   // 45% from carbs (4 cal/g)
        fat: Math.round(caloriesNum * 0.3 / 9)       // 30% from fat (9 cal/g)
      };
    }
    
    const newEntry: FoodEntry = {
      id: generateId(),
      name: foodName,
      calories: Number(calories),
      macros,
      timestamp: new Date().toISOString()
    };
    
    addFoodEntry(newEntry);
    toast.success("Repas ajouté");
    
    // Reset form
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setOpen(false);
    
    if (onAdd) onAdd();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un repas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un repas</DialogTitle>
        </DialogHeader>
        
        <Tabs
          defaultValue="simple"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="food-name">Nom du repas</Label>
              <Input
                id="food-name"
                placeholder="Ex: Salade composée"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input
                id="calories"
                type="number"
                placeholder="Ex: 350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            
            <TabsContent value="advanced" className="mt-0 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="protein">Protéines (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="30"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Glucides (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="40"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Lipides (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    placeholder="15"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <Button onClick={handleSubmit} className="w-full">
          Ajouter
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddForm;
