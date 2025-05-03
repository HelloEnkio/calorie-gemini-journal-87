import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FoodEntry, MacroNutrients } from "@/types";
import { addFoodEntry, generateId } from "@/utils/storage";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { searchFoods, FoodItem, updateFoodItem } from "@/utils/foodDatabase";
import FoodNameInput from "./FoodNameInput";
import NutritionFields from "./NutritionFields";

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
  
  // Auto-update toggle
  const [autoUpdateMacros, setAutoUpdateMacros] = useState<boolean>(true);
  
  // Track original values for proportion calculations
  const [originalFoodItem, setOriginalFoodItem] = useState<FoodItem | null>(null);
  const [originalQuantity, setOriginalQuantity] = useState<string | null>(null);
  const [originalCalories, setOriginalCalories] = useState<string | null>(null);
  const [originalProtein, setOriginalProtein] = useState<string | null>(null);
  const [originalCarbs, setOriginalCarbs] = useState<string | null>(null);
  const [originalFat, setOriginalFat] = useState<string | null>(null);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  // Search for food items when user types
  useEffect(() => {
    setIsSearching(true);
    const results = searchFoods(foodName);
    setSuggestions(results);
    setShowSuggestions(true);
    setIsSearching(false);
  }, [foodName]);
  
  // Show default suggestions when input is focused
  const handleInputFocus = () => {
    if (!showSuggestions) {
      setIsSearching(true);
      const results = searchFoods(foodName);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsSearching(false);
    }
  };
  
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
  
  // Update macros based on quantity
  const updateMacrosBasedOnQuantity = () => {
    if (!originalQuantity || Number(originalQuantity) <= 0 || !weight) return;

    const ratio = Number(weight) / Number(originalQuantity);
    
    if (originalCalories) setCalories((Number(originalCalories) * ratio).toFixed(0));
    if (originalProtein) setProtein((Number(originalProtein) * ratio).toFixed(1));
    if (originalCarbs) setCarbs((Number(originalCarbs) * ratio).toFixed(1));
    if (originalFat) setFat((Number(originalFat) * ratio).toFixed(1));
  };
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (food: FoodItem) => {
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setProtein(food.macros.protein.toString());
    setCarbs(food.macros.carbs.toString());
    setFat(food.macros.fat.toString());
    
    // Store original values
    setOriginalFoodItem(food);
    setOriginalCalories(food.calories.toString());
    setOriginalProtein(food.macros.protein.toString());
    setOriginalCarbs(food.macros.carbs.toString());
    setOriginalFat(food.macros.fat.toString());
    
    if (food.weight) {
      setWeight(food.weight.toString());
      setOriginalQuantity(food.weight.toString());
    }
    
    // We don't need to manually close suggestions here as it's now handled in FoodSuggestions component
  };
  
  // Form submission handler
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
        carbs: Math.round(caloriesNum * 0.45 / 4),
        fat: Math.round(caloriesNum * 0.3 / 9)
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
    
    // Update food item in the database if values changed and we selected an existing item
    if (originalFoodItem && 
        (originalFoodItem.calories !== Number(calories) ||
         originalFoodItem.macros.protein !== Number(protein) ||
         originalFoodItem.macros.carbs !== Number(carbs) ||
         originalFoodItem.macros.fat !== Number(fat) ||
         (originalFoodItem.weight && originalFoodItem.weight !== Number(weight)))) {
      
      // Create an updated version of the food item
      const updatedFoodItem: FoodItem = {
        ...originalFoodItem,
        calories: Number(calories),
        macros: {
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat)
        },
        weight: weight ? Number(weight) : originalFoodItem.weight
      };
      
      // Update the food item in the database
      updateFoodItem(updatedFoodItem);
    }
    
    addFoodEntry(newEntry);
    toast.success("Repas ajouté");

    // Reset form
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setWeight("");
    setOriginalFoodItem(null);
    setOriginalQuantity(null);
    setOriginalCalories(null);
    setOriginalProtein(null);
    setOriginalCarbs(null);
    setOriginalFat(null);
    if (onAdd) onAdd();
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <FoodNameInput 
            foodName={foodName}
            setFoodName={setFoodName}
            suggestions={suggestions}
            isSearching={isSearching}
            showSuggestions={showSuggestions}
            handleInputFocus={handleInputFocus}
            handleSelectSuggestion={handleSelectSuggestion}
            inputRef={inputRef}
            setShowSuggestions={setShowSuggestions}
          />
          
          <NutritionFields 
            calories={calories}
            setCalories={setCalories}
            protein={protein}
            setProtein={setProtein}
            carbs={carbs}
            setCarbs={setCarbs}
            fat={fat}
            setFat={setFat}
            weight={weight}
            setWeight={setWeight}
            autoUpdateMacros={autoUpdateMacros}
            setAutoUpdateMacros={setAutoUpdateMacros}
            originalQuantity={originalQuantity}
            updateMacrosBasedOnQuantity={updateMacrosBasedOnQuantity}
          />
          
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
