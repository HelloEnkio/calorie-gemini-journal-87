
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NutritionFieldsProps {
  calories: string;
  setCalories: (value: string) => void;
  protein: string;
  setProtein: (value: string) => void;
  carbs: string;
  setCarbs: (value: string) => void;
  fat: string;
  setFat: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  autoUpdateMacros: boolean;
  setAutoUpdateMacros: (value: boolean) => void;
  originalQuantity: string | null;
  updateMacrosBasedOnQuantity: () => void;
}

const NutritionFields = ({
  calories, setCalories,
  protein, setProtein,
  carbs, setCarbs,
  fat, setFat,
  weight, setWeight,
  autoUpdateMacros, setAutoUpdateMacros,
  originalQuantity,
  updateMacrosBasedOnQuantity
}: NutritionFieldsProps) => {
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setWeight(newValue);
    
    // If auto-update is on, update the nutrition values accordingly
    if (autoUpdateMacros && originalQuantity && Number(originalQuantity) > 0) {
      updateMacrosBasedOnQuantity();
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="calories">Calories (kcal)</Label>
          <Input 
            id="calories" 
            type="number" 
            placeholder="Ex: 350" 
            value={calories} 
            onChange={e => setCalories(e.target.value)} 
          />
        </div>
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <Label htmlFor="weight">Quantité (g)</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-update" className="text-xs text-muted-foreground">Auto</Label>
              <Switch 
                id="auto-update" 
                checked={autoUpdateMacros}
                onCheckedChange={setAutoUpdateMacros}
              />
            </div>
          </div>
          <Input 
            id="weight" 
            type="number" 
            placeholder="Ex: 100" 
            value={weight} 
            onChange={handleQuantityChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <Label htmlFor="protein">Protéines (g)</Label>
          <Input 
            id="protein" 
            type="number" 
            placeholder="30" 
            value={protein} 
            onChange={e => setProtein(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbs">Glucides (g)</Label>
          <Input 
            id="carbs" 
            type="number" 
            placeholder="40" 
            value={carbs} 
            onChange={e => setCarbs(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat">Lipides (g)</Label>
          <Input 
            id="fat" 
            type="number" 
            placeholder="15" 
            value={fat} 
            onChange={e => setFat(e.target.value)} 
          />
        </div>
      </div>
    </>
  );
};

export default NutritionFields;
