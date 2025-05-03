
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodEntry, MacroNutrients } from "@/types";
import { addFoodEntry, generateId } from "@/utils/storage";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { searchFoods, FoodItem } from "@/utils/foodDatabase";
import { cn } from "@/lib/utils";

interface QuickAddFormProps {
  onAdd?: () => void;
}

const QuickAddForm = ({ onAdd }: QuickAddFormProps) => {
  // Form state
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Search for food when the user types
  useEffect(() => {
    if (foodName.trim().length >= 2) {
      setIsSearching(true);
      const results = searchFoods(foodName);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsSearching(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [foodName]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (food: FoodItem) => {
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setProtein(food.macros.protein.toString());
    setCarbs(food.macros.carbs.toString());
    setFat(food.macros.fat.toString());
    if (food.weight) {
      setWeight(food.weight.toString());
    }
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (!foodName.trim()) {
      toast.error("Veuillez saisir un nom d'aliment");
      return;
    }
    if (!calories || isNaN(Number(calories)) || Number(calories) <= 0) {
      toast.error("Veuillez saisir un nombre de calories valide");
      return;
    }
    let macros: MacroNutrients = {
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0
    };

    // If macros are not provided, estimate them
    if (!protein && !carbs && !fat) {
      const caloriesNum = Number(calories);
      macros = {
        protein: Math.round(caloriesNum * 0.25 / 4),
        // 25% from protein (4 cal/g)
        carbs: Math.round(caloriesNum * 0.45 / 4),
        // 45% from carbs (4 cal/g)
        fat: Math.round(caloriesNum * 0.3 / 9) // 30% from fat (9 cal/g)
      };
    }
    const newEntry: FoodEntry = {
      id: generateId(),
      name: foodName,
      calories: Number(calories),
      macros,
      timestamp: new Date().toISOString(),
      weight: weight ? Number(weight) : undefined
    };
    addFoodEntry(newEntry);
    toast.success("Repas ajouté");

    // Reset form
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setWeight("");
    if (onAdd) onAdd();
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2 relative">
            <Label htmlFor="food-name">Nom du repas/produit</Label>
            <div className="relative">
              <Input 
                id="food-name" 
                placeholder="Ex: Salade composée" 
                value={foodName} 
                onChange={e => setFoodName(e.target.value)}
                ref={inputRef}
                autoComplete="off"
              />
              {isSearching && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            
            {showSuggestions && (
              <div 
                ref={suggestionRef}
                className="absolute z-10 mt-1 w-full border border-input bg-background shadow-md rounded-md py-1 max-h-60 overflow-auto"
              >
                {suggestions.map((food) => (
                  <div 
                    key={food.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectSuggestion(food)}
                  >
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-muted-foreground">{food.category}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {food.calories} kcal / 100g
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input id="calories" type="number" placeholder="Ex: 350" value={calories} onChange={e => setCalories(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Poids (g)</Label>
              <Input id="weight" type="number" placeholder="Ex: 100" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="protein">Protéines (g)</Label>
              <Input id="protein" type="number" placeholder="30" value={protein} onChange={e => setProtein(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Glucides (g)</Label>
              <Input id="carbs" type="number" placeholder="40" value={carbs} onChange={e => setCarbs(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Lipides (g)</Label>
              <Input id="fat" type="number" placeholder="15" value={fat} onChange={e => setFat(e.target.value)} />
            </div>
          </div>
          
          <Button onClick={handleSubmit} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter le repas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAddForm;
