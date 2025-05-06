
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FoodItem, MeasureUnit } from "@/types";
import FoodSuggestions from "../FoodSuggestions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddIngredientFormProps {
  currentIngredient: string;
  setCurrentIngredient: (value: string) => void;
  currentQuantity: string;
  setCurrentQuantity: (value: string) => void;
  currentUnit: MeasureUnit;
  setCurrentUnit: (value: MeasureUnit) => void;
  suggestions: FoodItem[];
  isSearching: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  addIngredient: (food: FoodItem) => void;
  searchIngredients: (query: string) => void;
}

const AddIngredientForm = ({
  currentIngredient,
  setCurrentIngredient,
  currentQuantity,
  setCurrentQuantity,
  currentUnit,
  setCurrentUnit,
  suggestions,
  isSearching,
  showSuggestions,
  setShowSuggestions,
  addIngredient,
  searchIngredients
}: AddIngredientFormProps) => {
  // All available measurement units
  const measureUnits = [
    { value: MeasureUnit.GRAMS, label: "Grammes (g)" },
    { value: MeasureUnit.MILLILITERS, label: "Millilitres (ml)" },
    { value: MeasureUnit.CUP, label: "Tasse" },
    { value: MeasureUnit.TABLESPOON, label: "Cuillère à soupe" },
    { value: MeasureUnit.TEASPOON, label: "Cuillère à café" },
    { value: MeasureUnit.OUNCE, label: "Once (oz)" },
    { value: MeasureUnit.PIECE, label: "Pièce" }
  ];

  // Handle ingredient input change
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentIngredient(value);
    if (value.length > 0) {
      searchIngredients(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Custom handler to properly close the suggestions after selecting
  const handleSelectSuggestion = (food: FoodItem) => {
    setCurrentIngredient(food.name);
    setShowSuggestions(false);
    addIngredient(food);
  };

  // Handle input focus
  const handleFocus = () => {
    if (currentIngredient.length > 0) {
      searchIngredients(currentIngredient);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <Input
          value={currentIngredient}
          onChange={handleIngredientChange}
          placeholder="Rechercher un ingrédient"
          onFocus={handleFocus}
        />
        
        <FoodSuggestions
          suggestions={suggestions}
          isSearching={isSearching}
          showSuggestions={showSuggestions}
          onSelectSuggestion={handleSelectSuggestion}
          setShowSuggestions={setShowSuggestions}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          className="w-20"
          value={currentQuantity}
          onChange={(e) => setCurrentQuantity(e.target.value)}
          placeholder="Qté"
        />
        <Select
          value={currentUnit}
          onValueChange={(value) => setCurrentUnit(value as MeasureUnit)}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Unité" />
          </SelectTrigger>
          <SelectContent>
            {measureUnits.map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddIngredientForm;
