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
const QuickAddForm = ({
  onAdd
}: QuickAddFormProps) => {
  const {
    protectAction
  } = useProtectedAction();
  const {
    subscriptionPlan
  } = useAuth();
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
  return <Card className="mb-4">
      
    </Card>;
};
export default QuickAddForm;