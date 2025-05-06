
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodItem } from "@/types";
import NutritionFields from "../NutritionFields";

interface SimpleFoodFormProps {
  foodName: string;
  setFoodName: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
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
}

const SimpleFoodForm = ({
  foodName,
  setFoodName,
  category,
  setCategory,
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
}: SimpleFoodFormProps) => {
  // Function for updating macros based on quantity
  const updateMacrosBasedOnQuantity = () => {
    // This function would be used if we implemented the modification of an existing food item
    return;
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="food-name">Nom de l'aliment</Label>
        <Input 
          id="food-name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Ex: Yaourt grec"
        />
      </div>
      
      <div>
        <Label htmlFor="food-category">Catégorie</Label>
        <Input
          id="food-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Ex: Produits laitiers"
        />
      </div>
      
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
        originalQuantity={null}
        updateMacrosBasedOnQuantity={updateMacrosBasedOnQuantity}
      />
    </div>
  );
};

export default SimpleFoodForm;
