
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodItem, RecipeItem, RecipeIngredient, MeasureUnit, MacroNutrients } from "@/types";
import { addFoodItem, createRecipe } from "@/utils/foodDatabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import SimpleFoodForm from "./SimpleFood/SimpleFoodForm";
import RecipeForm from "./Recipe/RecipeForm";

interface CreateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFoodName?: string;
  onCreated: (foodItem: FoodItem) => void;
}

interface IngredientState {
  id: string;
  foodId: string;
  foodItemId?: string;
  name: string;
  amount: number;
  quantity: number;
  unit: MeasureUnit;
  calories: number;
  macros: MacroNutrients;
}

const CreateFoodModal = ({ isOpen, onClose, initialFoodName = "", onCreated }: CreateFoodModalProps) => {
  const [activeTab, setActiveTab] = useState("aliment");
  
  // Simple food state
  const [foodName, setFoodName] = useState(initialFoodName);
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [weight, setWeight] = useState<string>("100");
  const [category, setCategory] = useState<string>("");
  const [autoUpdateMacros, setAutoUpdateMacros] = useState<boolean>(true);
  
  // Recipe state
  const [recipeName, setRecipeName] = useState(initialFoodName);
  const [ingredients, setIngredients] = useState<IngredientState[]>([]);
  
  // Create a simple food item
  const handleCreateSingleFood = () => {
    if (!foodName.trim()) {
      toast.error("Veuillez saisir un nom d'aliment");
      return;
    }
    
    if (!calories || isNaN(Number(calories)) || Number(calories) <= 0) {
      toast.error("Veuillez saisir un nombre de calories valide");
      return;
    }
    
    const newFoodItem: FoodItem = {
      id: uuidv4(),
      name: foodName.trim(),
      calories: Number(calories),
      macros: {
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
      },
      weight: Number(weight) || 100,
      category: category || "Personnalisé"
    };
    
    const success = addFoodItem(newFoodItem);
    
    if (success) {
      toast.success("Aliment ajouté à la base de données");
      onCreated(newFoodItem);
      onClose();
    } else {
      toast.error("Un aliment avec ce nom existe déjà");
    }
  };
  
  // Create a recipe
  const handleCreateRecipe = () => {
    if (!recipeName.trim()) {
      toast.error("Veuillez saisir un nom de recette");
      return;
    }
    
    if (ingredients.length === 0) {
      toast.error("Veuillez ajouter au moins un ingrédient");
      return;
    }
    
    // Calculate recipe nutrition information using RecipeForm's helper functions
    const getConversionFactor = (unit: MeasureUnit): number => {
      switch (unit) {
        case MeasureUnit.GRAMS: return 1;
        case MeasureUnit.MILLILITERS: return 1;
        case MeasureUnit.CUP: return 240;
        case MeasureUnit.TABLESPOON: return 15;
        case MeasureUnit.TEASPOON: return 5;
        case MeasureUnit.OUNCE: return 28;
        case MeasureUnit.PIECE: return 100;
        default: return 1;
      }
    };
    
    const totalMacros = ingredients.reduce((acc, ingredient) => {
      const foodItem = searchFoods(ingredient.name)[0];
      if (foodItem) {
        const gramEquivalent = ingredient.amount * getConversionFactor(ingredient.unit);
        const ratio = gramEquivalent / (foodItem.weight || 100);
        
        acc.calories += foodItem.calories * ratio;
        acc.protein += foodItem.macros.protein * ratio;
        acc.carbs += foodItem.macros.carbs * ratio;
        acc.fat += foodItem.macros.fat * ratio;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const totalWeight = ingredients.reduce((sum, ing) => {
      const gramEquivalent = ing.amount * getConversionFactor(ing.unit);
      return sum + gramEquivalent;
    }, 0);
    
    // Convert ingredients to RecipeIngredient[] type
    const recipeIngredients: RecipeIngredient[] = ingredients.map(ing => ({
      id: ing.id,
      foodId: ing.foodId,
      name: ing.name,
      amount: ing.amount,
      quantity: ing.quantity,
      unit: ing.unit,
      calories: ing.calories,
      macros: ing.macros,
      foodItemId: ing.foodItemId
    }));
    
    const newRecipe: RecipeItem = {
      id: uuidv4(),
      name: recipeName.trim(),
      calories: Math.round(totalMacros.calories),
      macros: {
        protein: Math.round(totalMacros.protein * 10) / 10,
        carbs: Math.round(totalMacros.carbs * 10) / 10,
        fat: Math.round(totalMacros.fat * 10) / 10
      },
      weight: totalWeight,
      category: "Recette",
      ingredients: recipeIngredients,
      isRecipe: true,
      servings: 1
    };
    
    const success = createRecipe(newRecipe);
    
    if (success) {
      toast.success("Recette ajoutée à la base de données");
      onCreated(newRecipe);
      onClose();
    } else {
      toast.error("Une recette avec ce nom existe déjà");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel aliment ou une recette</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel aliment à la base de données ou créez une recette à partir d'ingrédients existants.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="aliment">Aliment simple</TabsTrigger>
            <TabsTrigger value="recette">Recette</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aliment" className="space-y-4 mt-4">
            <SimpleFoodForm
              foodName={foodName}
              setFoodName={setFoodName}
              category={category}
              setCategory={setCategory}
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
            />
          </TabsContent>
          
          <TabsContent value="recette" className="space-y-4 mt-4">
            <RecipeForm
              recipeName={recipeName}
              setRecipeName={setRecipeName}
              ingredients={ingredients as any}
              setIngredients={setIngredients as any}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1 order-2 w-full sm:w-auto">Annuler</Button>
          <Button 
            onClick={activeTab === "aliment" ? handleCreateSingleFood : handleCreateRecipe}
            className="sm:order-2 order-1 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "aliment" ? "Créer l'aliment" : "Créer la recette"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function for the component
const searchFoods = (query: string): FoodItem[] => {
  // Import this directly in the component to avoid circular dependencies
  return (window as any).searchFoods ? (window as any).searchFoods(query) : [];
};

export default CreateFoodModal;
