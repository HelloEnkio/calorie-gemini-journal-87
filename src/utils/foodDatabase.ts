
import { FoodItem, RecipeItem } from "@/types";

// Clés pour le stockage local des aliments
const FOOD_ITEMS_KEY = "nutrition-tracker-food-items";
const RECIPES_KEY = "nutrition-tracker-recipes";

// Charger les aliments de la base de données (localStorage)
const loadFoodItems = (): FoodItem[] => {
  const storedItems = localStorage.getItem(FOOD_ITEMS_KEY);
  
  if (!storedItems) {
    // Initialiser avec quelques aliments par défaut si le localStorage est vide
    const defaultItems = getDefaultFoodItems();
    localStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(defaultItems));
    return defaultItems;
  }
  
  try {
    return JSON.parse(storedItems);
  } catch (error) {
    console.error("Erreur lors du chargement des aliments:", error);
    return [];
  }
};

// Charger les recettes de la base de données (localStorage)
const loadRecipes = (): RecipeItem[] => {
  const storedRecipes = localStorage.getItem(RECIPES_KEY);
  
  if (!storedRecipes) {
    return [];
  }
  
  try {
    return JSON.parse(storedRecipes);
  } catch (error) {
    console.error("Erreur lors du chargement des recettes:", error);
    return [];
  }
};

// Rechercher des aliments ou recettes par nom
export const searchFoods = (query: string): FoodItem[] => {
  if (!query || query.trim() === "") {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  const foodItems = loadFoodItems();
  const recipes = loadRecipes();
  
  // Combiner aliments et recettes
  const allItems = [...foodItems, ...recipes];
  
  return allItems.filter(item => 
    item.name.toLowerCase().includes(normalizedQuery)
  );
};

// Ajouter un nouvel aliment à la base de données
export const addFoodItem = (newItem: FoodItem): boolean => {
  const foodItems = loadFoodItems();
  
  // Vérifier si un aliment avec le même nom existe déjà
  const itemExists = foodItems.some(item => 
    item.name.toLowerCase() === newItem.name.toLowerCase()
  );
  
  if (itemExists) {
    return false;
  }
  
  foodItems.push(newItem);
  localStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(foodItems));
  
  // Exposer à la fenêtre pour utilisation dans la création de recette
  (window as any).searchFoods = searchFoods;
  
  return true;
};

// Ajouter une nouvelle recette à la base de données
export const createRecipe = (newRecipe: RecipeItem): boolean => {
  const recipes = loadRecipes();
  
  // Vérifier si une recette avec le même nom existe déjà
  const recipeExists = recipes.some(recipe => 
    recipe.name.toLowerCase() === newRecipe.name.toLowerCase()
  );
  
  if (recipeExists) {
    return false;
  }
  
  recipes.push(newRecipe);
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  
  return true;
};

// Obtenir un aliment par ID
export const getFoodItemById = (id: string): FoodItem | null => {
  const foodItems = loadFoodItems();
  const recipes = loadRecipes();
  const allItems = [...foodItems, ...recipes];
  
  return allItems.find(item => item.id === id) || null;
};

// Obtenir des aliments par défaut
export const getDefaultFoodItems = (): FoodItem[] => {
  return [
    {
      id: "default-1",
      name: "Pomme",
      calories: 52,
      macros: {
        protein: 0.3,
        carbs: 14,
        fat: 0.2
      },
      weight: 100,
      category: "Fruits"
    },
    {
      id: "default-2",
      name: "Œuf",
      calories: 68,
      macros: {
        protein: 5.5,
        carbs: 0.5,
        fat: 4.8
      },
      weight: 50,
      category: "Protéines"
    },
    {
      id: "default-3",
      name: "Riz blanc cuit",
      calories: 130,
      macros: {
        protein: 2.7,
        carbs: 28.2,
        fat: 0.3
      },
      weight: 100,
      category: "Céréales"
    },
    {
      id: "default-4",
      name: "Blanc de poulet",
      calories: 165,
      macros: {
        protein: 31,
        carbs: 0,
        fat: 3.6
      },
      weight: 100,
      category: "Protéines"
    },
    {
      id: "default-5",
      name: "Yaourt nature",
      calories: 59,
      macros: {
        protein: 3.5,
        carbs: 4.7,
        fat: 3.2
      },
      weight: 100,
      category: "Produits laitiers"
    }
  ];
};

// Initialiser les données de la base de données alimentaire
export const initFoodDatabase = () => {
  // S'assurer que les aliments par défaut sont chargés
  const foodItems = loadFoodItems();
  
  // Exposer la fonction de recherche à la fenêtre globale
  (window as any).searchFoods = searchFoods;
  
  console.log(`Base de données alimentaire initialisée avec ${foodItems.length} aliments`);
};

// Exposer la fonction de recherche à la fenêtre pour qu'elle soit accessible depuis CreateFoodModal
(window as any).searchFoods = searchFoods;
