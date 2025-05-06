
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FoodSuggestions from "./FoodSuggestions";
import CreateFoodModal from "./CreateFoodModal";
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Add a handler for input blur to give a small delay before hiding suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(e.target.value);
    // Ensure suggestions are shown when typing
    if (!showSuggestions && e.target.value) {
      setShowSuggestions(true);
    }
  };
  
  // Vérifier si l'aliment existe déjà dans les suggestions
  const foodExistsInSuggestions = foodName.trim() !== "" && suggestions.some(
    food => food.name.toLowerCase() === foodName.trim().toLowerCase()
  );
  
  // Gérer la création d'un nouvel aliment
  const handleCreateFood = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="food-name" className="text-sm font-medium">Nom du repas/produit</Label>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input 
              id="food-name" 
              placeholder="Ex: Salade composée" 
              value={foodName} 
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              ref={inputRef}
              autoComplete="off"
              className="floating-input"
            />
          </div>
          
          {foodName.trim() !== "" && !foodExistsInSuggestions && !isSearching && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleCreateFood}
              title="Créer un nouvel aliment"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <FoodSuggestions 
        suggestions={suggestions}
        isSearching={isSearching}
        showSuggestions={showSuggestions}
        onSelectSuggestion={handleSelectSuggestion}
        setShowSuggestions={setShowSuggestions}
        suggestionRef={suggestionRef}
      />
      
      {/* Modal de création d'aliment */}
      <CreateFoodModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialFoodName={foodName}
        onCreated={handleSelectSuggestion}
      />
    </div>
  );
};

export default FoodNameInput;
