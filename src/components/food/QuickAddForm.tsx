import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import FoodNameInput from "./FoodNameInput";
import NutritionFields from "./NutritionFields";
import { useQuickAddForm } from "@/hooks/useQuickAddForm";
import { useFoodSuggestions } from "@/hooks/useFoodSuggestions";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { useAuth } from "@/contexts/AuthContext";

interface QuickAddFormProps {
  onAdd?: () => void;
}

const QuickAddForm = ({ onAdd }: QuickAddFormProps) => {
  const { protectAction } = useProtectedAction();
  const { subscriptionPlan } = useAuth();
  const showAIButton = subscriptionPlan === "premium";
  
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
    hideSuggestions,
    inputRef,
    suggestionRef
  } = useFoodSuggestions(foodName);
  
  const handleProtectedSubmit = () => {
    protectAction(() => handleSubmit());
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
            suggestionRef={suggestionRef}
            hideSuggestions={hideSuggestions}
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
          
          <div className="flex flex-col gap-2">
            <Button onClick={handleProtectedSubmit} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter le repas
            </Button>
            
            {showAIButton && (
              <Button variant="outline" className="w-full">
                Utiliser l'IA (Premium)
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAddForm;
