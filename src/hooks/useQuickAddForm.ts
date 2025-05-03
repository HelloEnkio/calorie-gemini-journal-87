
import { useState, useEffect } from "react";
import { FoodItem, updateFoodItem } from "@/utils/foodDatabase";
import { addFoodEntry, generateId } from "@/utils/storage";
import { FoodEntry, MacroNutrients } from "@/types";
import { toast } from "sonner";

export const useQuickAddForm = (onAdd?: () => void) => {
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

  return {
    foodName,
    setFoodName,
    calories,
    setCalories,
    protein,
    setProtein,
    carbs,
    setCarbs,
    fat,
    setFat,
    weight,
    setWeight,
    autoUpdateMacros,
    setAutoUpdateMacros,
    originalQuantity,
    updateMacrosBasedOnQuantity,
    handleSelectSuggestion,
    handleSubmit
  };
};
