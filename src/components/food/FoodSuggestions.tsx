
import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { FoodItem } from "@/utils/foodDatabase";
import { cn } from "@/lib/utils";

interface FoodSuggestionsProps {
  suggestions: FoodItem[];
  isSearching: boolean;
  showSuggestions: boolean;
  onSelectSuggestion: (food: FoodItem) => void;
}

const FoodSuggestions = ({
  suggestions,
  isSearching,
  showSuggestions,
  onSelectSuggestion,
}: FoodSuggestionsProps) => {
  const suggestionRef = useRef<HTMLDivElement>(null);

  if (!showSuggestions) {
    return null;
  }

  return (
    <div 
      ref={suggestionRef}
      className="absolute z-10 mt-1 w-full border border-input bg-background shadow-md rounded-md py-1 max-h-60 overflow-auto"
    >
      {isSearching && (
        <div className="flex items-center justify-center py-2">
          <Search className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {!isSearching && suggestions.length > 0 ? (
        suggestions.map((food) => (
          <div 
            key={food.id}
            className="px-3 py-2 hover:bg-muted cursor-pointer flex justify-between items-center"
            onClick={() => onSelectSuggestion(food)}
          >
            <div>
              <div className="font-medium">{food.name}</div>
              <div className="text-xs text-muted-foreground">{food.category}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {food.calories} kcal / 100g
            </div>
          </div>
        ))
      ) : (
        <div className="px-3 py-2 text-muted-foreground">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
};

export default FoodSuggestions;
