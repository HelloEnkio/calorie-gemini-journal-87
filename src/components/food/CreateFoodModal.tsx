
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodItem, RecipeItem, RecipeIngredient, MeasureUnit } from "@/types";
import { searchFoods, addFoodItem, createRecipe } from "@/utils/foodDatabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import NutritionFields from "./NutritionFields";
import { Plus, X } from "lucide-react";
import FoodSuggestions from "./FoodSuggestions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFoodName?: string;
  onCreated: (foodItem: FoodItem) => void;
}

const CreateFoodModal = ({ isOpen, onClose, initialFoodName = "", onCreated }: CreateFoodModalProps) => {
  const [activeTab, setActiveTab] = useState("aliment");
  
  // Aliment simple
  const [foodName, setFoodName] = useState(initialFoodName);
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [weight, setWeight] = useState<string>("100");
  const [category, setCategory] = useState<string>("");
  
  // Recette
  const [recipeName, setRecipeName] = useState(initialFoodName);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<string>("100");
  const [currentUnit, setCurrentUnit] = useState<MeasureUnit>("g");
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // État pour le calcul automatique des macros
  const [autoUpdateMacros, setAutoUpdateMacros] = useState<boolean>(true);
  
  // Liste des unités de mesure disponibles
  const measureUnits: { value: MeasureUnit; label: string }[] = [
    { value: "g", label: "Grammes (g)" },
    { value: "ml", label: "Millilitres (ml)" },
    { value: "cup", label: "Tasse" },
    { value: "tbsp", label: "Cuillère à soupe" },
    { value: "tsp", label: "Cuillère à café" },
    { value: "oz", label: "Once (oz)" },
    { value: "piece", label: "Pièce" }
  ];
  
  // Fonction pour rechercher des ingrédients
  const searchIngredients = (query: string) => {
    setIsSearching(true);
    const results = searchFoods(query);
    setSuggestions(results);
    setShowSuggestions(true);
    setIsSearching(false);
  };
  
  // Gestionnaire de changement d'ingrédient
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentIngredient(value);
    searchIngredients(value);
  };
  
  // Ajouter un ingrédient à la recette
  const addIngredient = (foodItem: FoodItem) => {
    const newIngredient: RecipeIngredient = {
      foodItemId: foodItem.id,
      quantity: parseInt(currentQuantity) || 100,
      unit: currentUnit,
      name: foodItem.name
    };
    
    setIngredients([...ingredients, newIngredient]);
    setCurrentIngredient("");
    setCurrentQuantity("100");
    setCurrentUnit("g"); // Réinitialiser à grammes par défaut
    setShowSuggestions(false);
  };
  
  // Supprimer un ingrédient
  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // Fonction pour obtenir le facteur de conversion des unités vers grammes
  // Ceci est une approximation simplifiée car chaque aliment a une densité différente
  const getConversionFactor = (unit: MeasureUnit): number => {
    switch (unit) {
      case 'g': return 1;
      case 'ml': return 1; // Approximation: 1ml ≈ 1g (pour l'eau)
      case 'cup': return 240; // 1 tasse ≈ 240g
      case 'tbsp': return 15; // 1 cuillère à soupe ≈ 15g
      case 'tsp': return 5; // 1 cuillère à café ≈ 5g
      case 'oz': return 28; // 1 once ≈ 28g
      case 'piece': return 100; // Approximation: 1 pièce ≈ 100g (très variable)
      default: return 1;
    }
  };
  
  // Calculer les macros de la recette
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
        // Convertir la quantité selon l'unité
        const gramEquivalent = ingredient.quantity * getConversionFactor(ingredient.unit);
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
  
  // Calculer le poids total de la recette
  const calculateTotalWeight = (): number => {
    return ingredients.reduce((sum, ing) => {
      const gramEquivalent = ing.quantity * getConversionFactor(ing.unit);
      return sum + gramEquivalent;
    }, 0);
  };
  
  // Créer un aliment simple
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
  
  // Créer une recette
  const handleCreateRecipe = () => {
    if (!recipeName.trim()) {
      toast.error("Veuillez saisir un nom de recette");
      return;
    }
    
    if (ingredients.length === 0) {
      toast.error("Veuillez ajouter au moins un ingrédient");
      return;
    }
    
    const macros = calculateRecipeMacros();
    const totalWeight = calculateTotalWeight();
    
    const newRecipe: RecipeItem = {
      id: uuidv4(),
      name: recipeName.trim(),
      calories: macros.calories,
      macros: {
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat
      },
      weight: totalWeight,
      category: "Recette",
      ingredients,
      isRecipe: true
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
  
  // Fonction pour mettre à jour les macros en fonction de la quantité
  const updateMacrosBasedOnQuantity = () => {
    // Cette fonction serait utilisée si on implémentait la modification d'un aliment existant
    return;
  };
  
  // Formater l'affichage de l'unité
  const formatUnit = (unit: MeasureUnit): string => {
    const unitItem = measureUnits.find(u => u.value === unit);
    return unitItem ? unitItem.label.split(' ')[0] : unit;
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
            <div className="space-y-3">
              <div>
                <Label htmlFor="food-name">Nom de l'aliment</Label>
                <Input 
                  id="food-name"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Ex: Yaourt grec"
                />
              </div>
              
              <div>
                <Label htmlFor="food-category">Catégorie</Label>
                <Input
                  id="food-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Produits laitiers"
                />
              </div>
              
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
                originalQuantity={null}
                updateMacrosBasedOnQuantity={updateMacrosBasedOnQuantity}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="recette" className="space-y-4 mt-4">
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Input
                      value={currentIngredient}
                      onChange={handleIngredientChange}
                      placeholder="Rechercher un ingrédient"
                      onFocus={() => searchIngredients(currentIngredient)}
                    />
                    
                    {showSuggestions && (
                      <FoodSuggestions
                        suggestions={suggestions}
                        isSearching={isSearching}
                        showSuggestions={showSuggestions}
                        onSelectSuggestion={(food) => {
                          setCurrentIngredient(food.name);
                          setShowSuggestions(false);
                          addIngredient(food);
                        }}
                        setShowSuggestions={setShowSuggestions}
                      />
                    )}
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
                
                <div className="max-h-40 overflow-y-auto">
                  {ingredients.map((ing, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <span className="font-medium">{ing.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {ing.quantity} {formatUnit(ing.unit)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {ingredients.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucun ingrédient ajouté
                    </div>
                  )}
                </div>
              </div>
              
              {ingredients.length > 0 && (
                <div className="border p-3 rounded-md">
                  <h3 className="font-medium mb-2">Valeurs nutritionnelles calculées</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Calories:</span>
                      <span className="font-medium ml-1">{calculateRecipeMacros().calories} kcal</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Protéines:</span>
                      <span className="font-medium ml-1">{calculateRecipeMacros().protein}g</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Glucides:</span>
                      <span className="font-medium ml-1">{calculateRecipeMacros().carbs}g</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Lipides:</span>
                      <span className="font-medium ml-1">{calculateRecipeMacros().fat}g</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Poids total:</span>
                      <span className="font-medium ml-1">
                        {calculateTotalWeight()}g
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

export default CreateFoodModal;
