
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import FoodNameInput from "./FoodNameInput";
import NutritionFields from "./NutritionFields";
import { useQuickAddForm } from "@/hooks/useQuickAddForm";
import { useFoodSuggestions } from "@/hooks/useFoodSuggestions";

interface QuickAddFormProps {
  onAdd?: () => void;
}

const QuickAddForm = ({ onAdd }: QuickAddFormProps) => {
  const {
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
  } = useQuickAddForm(onAdd);

  const {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearching,
    handleInputFocus,
    inputRef,
    suggestionRef
  } = useFoodSuggestions(foodName);
  
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
            suggestionRef={suggestionRef}
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
