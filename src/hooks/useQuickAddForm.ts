
import { useState } from "react";
import { FoodItem } from "@/types";
import { addFoodEntry, generateId } from "@/utils/storage";
import { toast } from "sonner";

export const useQuickAddForm = (onAdd?: () => void) => {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [weight, setWeight] = useState("100");
  const [autoUpdateMacros, setAutoUpdateMacros] = useState(true);
  const [originalQuantity, setOriginalQuantity] = useState<string | null>(null);
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setWeight("100");
    setOriginalQuantity(null);
  };
  
  // Mettre à jour les macronutriments en fonction de la quantité
  const updateMacrosBasedOnQuantity = () => {
    if (!autoUpdateMacros || !originalQuantity) return;
    
    const originalValue = Number(originalQuantity);
    const newValue = Number(weight);
    
    if (originalValue > 0 && newValue > 0 && newValue !== originalValue) {
      const ratio = newValue / originalValue;
      
      const originalCalories = Number(calories);
      const originalProtein = Number(protein);
      const originalCarbs = Number(carbs);
      const originalFat = Number(fat);
      
      setCalories(Math.round(originalCalories * ratio).toString());
      setProtein(Math.round(originalProtein * ratio * 10) / 10 + "");
      setCarbs(Math.round(originalCarbs * ratio * 10) / 10 + "");
      setFat(Math.round(originalFat * ratio * 10) / 10 + "");
    }
  };
  
  // Gérer la sélection d'un aliment dans les suggestions
  const handleSelectSuggestion = (food: FoodItem) => {
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setProtein(food.macros.protein.toString());
    setCarbs(food.macros.carbs.toString());
    setFat(food.macros.fat.toString());
    setWeight((food.weight || 100).toString());
    setOriginalQuantity((food.weight || 100).toString());
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    if (!foodName.trim()) {
      toast.error("Veuillez saisir un nom de repas ou d'aliment");
      return;
    }
    
    if (!calories || isNaN(Number(calories)) || Number(calories) <= 0) {
      toast.error("Veuillez saisir un nombre de calories valide");
      return;
    }
    
    // Ajouter l'aliment au journal
    addFoodEntry({
      id: generateId(),
      name: foodName.trim(),
      calories: Number(calories),
      macros: {
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
      },
      timestamp: new Date().toISOString(),
      weight: Number(weight) || 100
    });
    
    toast.success("Repas ou aliment ajouté avec succès");
    resetForm();
    
    // Appel du callback si fourni
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
    handleSubmit,
    resetForm
  };
};
