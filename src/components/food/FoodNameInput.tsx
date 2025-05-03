
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
  suggestionRef?: React.RefObject<HTMLDivElement>;
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
  setShowSuggestions,
  suggestionRef
}: FoodNameInputProps) => {
  // Add a handler for input blur to give a small delay before hiding suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(e.target.value);
    // Ensure suggestions are shown when typing
    if (!showSuggestions && e.target.value) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="food-name">Nom du repas/produit</Label>
      <div className="relative">
        <Input 
          id="food-name" 
          placeholder="Ex: Salade composée" 
          value={foodName} 
          onChange={handleInputChange}
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
        suggestionRef={suggestionRef}
      />
    </div>
  );
};

export default FoodNameInput;
