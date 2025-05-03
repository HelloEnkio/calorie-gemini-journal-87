
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FoodSuggestions from "./FoodSuggestions";
import { FoodItem } from "@/utils/foodDatabase";

interface FoodNameInputProps {
  foodName: string;
  setFoodName: (value: string) => void;
  suggestions: FoodItem[];
  isSearching: boolean;
  showSuggestions: boolean;
  handleInputFocus: () => void;
  handleSelectSuggestion: (food: FoodItem) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setShowSuggestions: (show: boolean) => void;
}

const FoodNameInput = ({
  foodName,
  setFoodName,
  suggestions,
  isSearching,
  showSuggestions,
  handleInputFocus,
  handleSelectSuggestion,
  inputRef,
  setShowSuggestions
}: FoodNameInputProps) => {
  return (
    <div className="space-y-2 relative">
      <Label htmlFor="food-name">Nom du repas/produit</Label>
      <div className="relative">
        <Input 
          id="food-name" 
          placeholder="Ex: Salade composée" 
          value={foodName} 
          onChange={e => setFoodName(e.target.value)}
          onFocus={handleInputFocus}
          ref={inputRef}
          autoComplete="off"
        />
      </div>
      
      <FoodSuggestions 
        suggestions={suggestions}
        isSearching={isSearching}
        showSuggestions={showSuggestions}
        onSelectSuggestion={handleSelectSuggestion}
        setShowSuggestions={setShowSuggestions}
      />
    </div>
  );
};

export default FoodNameInput;
