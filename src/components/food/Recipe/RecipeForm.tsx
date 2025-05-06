
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodItem, MeasureUnit, RecipeIngredient } from "@/types";
import AddIngredientForm from "./AddIngredientForm";
import IngredientItem from "./IngredientItem";
import RecipeNutritionSummary from "./RecipeNutritionSummary";
import { searchFoods } from "@/utils/foodDatabase";

interface RecipeFormProps {
  recipeName: string;
  setRecipeName: (value: string) => void;
  ingredients: RecipeIngredient[];
  setIngredients: (ingredients: RecipeIngredient[]) => void;
}

const RecipeForm = ({
  recipeName,
  setRecipeName,
  ingredients,
  setIngredients
}: RecipeFormProps) => {
  const [currentIngredient, setCurrentIngredient] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<string>("100");
  const [currentUnit, setCurrentUnit] = useState<MeasureUnit>(MeasureUnit.GRAMS);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Function to search for ingredients
  const searchIngredients = (query: string) => {
    setIsSearching(true);
    const results = searchFoods(query);
    setSuggestions(results);
    setShowSuggestions(true);
    setIsSearching(false);
  };
  
  // Add an ingredient to the recipe
  const addIngredient = (foodItem: FoodItem) => {
    const newIngredient: RecipeIngredient = {
      id: crypto.randomUUID(),
      foodId: foodItem.id,
      quantity: parseInt(currentQuantity) || 100,
      amount: parseInt(currentQuantity) || 100,
      unit: currentUnit,
      name: foodItem.name,
      calories: foodItem.calories,
      macros: foodItem.macros
    };
    
    setIngredients([...ingredients, newIngredient]);
    setCurrentIngredient("");
    setCurrentQuantity("100");
    setCurrentUnit(MeasureUnit.GRAMS); // Reset to grams by default
    setShowSuggestions(false);
  };
  
  // Remove an ingredient
  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };
  
  // Function to get the conversion factor from units to grams
  const getConversionFactor = (unit: MeasureUnit): number => {
    switch (unit) {
      case MeasureUnit.GRAMS: return 1;
      case MeasureUnit.MILLILITERS: return 1; // Approximation: 1ml ≈ 1g (for water)
      case MeasureUnit.CUP: return 240; // 1 cup ≈ 240g
      case MeasureUnit.TABLESPOON: return 15; // 1 tablespoon ≈ 15g
      case MeasureUnit.TEASPOON: return 5; // 1 teaspoon ≈ 5g
      case MeasureUnit.OUNCE: return 28; // 1 ounce ≈ 28g
      case MeasureUnit.PIECE: return 100; // Approximation: 1 piece ≈ 100g (highly variable)
      default: return 1;
    }
  };
  
  // Calculate recipe macros
  const calculateRecipeMacros = () => {
    const totalMacros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    ingredients.forEach(ingredient => {
      const foodItem = searchFoods(ingredient.name)[0];
      if (foodItem) {
        // Convert quantity according to unit
        const gramEquivalent = ingredient.amount * getConversionFactor(ingredient.unit);
        const ratio = gramEquivalent / (foodItem.weight || 100);
        
        totalMacros.calories += foodItem.calories * ratio;
        totalMacros.protein += foodItem.macros.protein * ratio;
        totalMacros.carbs += foodItem.macros.carbs * ratio;
        totalMacros.fat += foodItem.macros.fat * ratio;
      }
    });
    
    return {
      calories: Math.round(totalMacros.calories),
      protein: Math.round(totalMacros.protein * 10) / 10,
      carbs: Math.round(totalMacros.carbs * 10) / 10,
      fat: Math.round(totalMacros.fat * 10) / 10
    };
  };
  
  // Calculate total recipe weight
  const calculateTotalWeight = (): number => {
    return ingredients.reduce((sum, ing) => {
      const gramEquivalent = ing.amount * getConversionFactor(ing.unit);
      return sum + gramEquivalent;
    }, 0);
  };
  
  const macros = calculateRecipeMacros();
  const totalWeight = calculateTotalWeight();

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="recipe-name">Nom de la recette</Label>
        <Input 
          id="recipe-name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Ex: Salade composée"
        />
      </div>
      
      <div className="border p-3 rounded-md space-y-2">
        <Label>Ajouter des ingrédients</Label>
        <AddIngredientForm
          currentIngredient={currentIngredient}
          setCurrentIngredient={setCurrentIngredient}
          currentQuantity={currentQuantity}
          setCurrentQuantity={setCurrentQuantity}
          currentUnit={currentUnit}
          setCurrentUnit={setCurrentUnit}
          suggestions={suggestions}
          isSearching={isSearching}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          addIngredient={addIngredient}
          searchIngredients={searchIngredients}
        />
        
        <div className="max-h-40 overflow-y-auto">
          {ingredients.map((ing, index) => (
            <IngredientItem
              key={index}
              name={ing.name}
              quantity={ing.amount}
              unit={ing.unit}
              onRemove={() => removeIngredient(index)}
            />
          ))}
          
          {ingredients.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              Aucun ingrédient ajouté
            </div>
          )}
        </div>
      </div>
      
      {ingredients.length > 0 && (
        <RecipeNutritionSummary
          calories={macros.calories}
          protein={macros.protein}
          carbs={macros.carbs}
          fat={macros.fat}
          totalWeight={totalWeight}
        />
      )}
    </div>
  );
};

export default RecipeForm;
