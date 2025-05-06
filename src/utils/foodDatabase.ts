
import { FuzzySearch } from './fuzzySearch';
import { FoodItem, RecipeItem, RecipeIngredient } from '@/types';

// Base de données simulée d'aliments
const foodDatabase: FoodItem[] = [
  {
    id: "1",
    name: "Poulet grillé",
    calories: 165,
    macros: {
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    weight: 100,
    category: "Viandes"
  },
  {
    id: "2",
    name: "Riz blanc cuit",
    calories: 130,
    macros: {
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "3",
    name: "Saumon",
    calories: 208,
    macros: {
      protein: 20,
      carbs: 0,
      fat: 13,
    },
    weight: 100,
    category: "Poissons"
  },
  {
    id: "4",
    name: "Banane",
    calories: 89,
    macros: {
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
    },
    weight: 100,
    category: "Fruits"
  },
  {
    id: "5",
    name: "Œuf entier",
    calories: 155,
    macros: {
      protein: 13,
      carbs: 1.1,
      fat: 11,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "6",
    name: "Pain complet",
    calories: 247,
    macros: {
      protein: 13,
      carbs: 41,
      fat: 3,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "7",
    name: "Pomme",
    calories: 52,
    macros: {
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
    },
    weight: 100,
    category: "Fruits"
  },
  {
    id: "8",
    name: "Lentilles cuites",
    calories: 116,
    macros: {
      protein: 9,
      carbs: 20,
      fat: 0.4,
    },
    weight: 100,
    category: "Légumineuses"
  },
  {
    id: "9",
    name: "Yaourt nature",
    calories: 59,
    macros: {
      protein: 3.5,
      carbs: 4.7,
      fat: 3.3,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "10",
    name: "Brocoli cuit",
    calories: 35,
    macros: {
      protein: 2.4,
      carbs: 7.2,
      fat: 0.4,
    },
    weight: 100,
    category: "Légumes"
  },
  {
    id: "11",
    name: "Fromage cheddar",
    calories: 402,
    macros: {
      protein: 25,
      carbs: 1.3,
      fat: 33.1,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "12",
    name: "Pâtes cuites",
    calories: 158,
    macros: {
      protein: 5.8,
      carbs: 31,
      fat: 0.9,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "13",
    name: "Steak de bœuf",
    calories: 271,
    macros: {
      protein: 26,
      carbs: 0,
      fat: 19,
    },
    weight: 100,
    category: "Viandes"
  },
  {
    id: "14",
    name: "Avocat",
    calories: 160,
    macros: {
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
    },
    weight: 100,
    category: "Fruits"
  },
  {
    id: "15",
    name: "Lait entier",
    calories: 61,
    macros: {
      protein: 3.2,
      carbs: 4.8,
      fat: 3.6,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "16",
    name: "Patate douce",
    calories: 86,
    macros: {
      protein: 1.6,
      carbs: 20.1,
      fat: 0.1,
    },
    weight: 100,
    category: "Légumes"
  },
  {
    id: "17",
    name: "Amandes",
    calories: 579,
    macros: {
      protein: 21.1,
      carbs: 21.7,
      fat: 49.9,
    },
    weight: 100,
    category: "Fruits à coque"
  },
  {
    id: "18",
    name: "Quinoa cuit",
    calories: 120,
    macros: {
      protein: 4.4,
      carbs: 21.3,
      fat: 1.9,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "19",
    name: "Salade verte",
    calories: 15,
    macros: {
      protein: 1.4,
      carbs: 2.9,
      fat: 0.2,
    },
    weight: 100,
    category: "Légumes"
  },
  {
    id: "20",
    name: "Thon en conserve",
    calories: 116,
    macros: {
      protein: 25.5,
      carbs: 0,
      fat: 1,
    },
    weight: 100,
    category: "Poissons"
  }
];

// Base de données des recettes
const recipeDatabase: RecipeItem[] = [];

// Initialiser le moteur de recherche floue avec les noms des aliments
const foodSearchEngine = new FuzzySearch(foodDatabase, ['name', 'category'], {
  threshold: 0.2,
  caseSensitive: false,
  maxResults: 5,
});

/**
 * Recherche des aliments dans la base de données
 * @param query Terme de recherche
 * @returns Liste d'aliments correspondants
 */
export const searchFoods = (query: string): FoodItem[] => {
  if (!query || query.trim() === '') {
    // Renvoyer les 5 premiers aliments par défaut
    return [...foodDatabase, ...recipeDatabase].slice(0, 5);
  }
  
  // Rechercher dans les aliments simples
  const foodResults = foodSearchEngine.search(query);
  
  // Rechercher dans les recettes (recherche simple pour l'instant)
  const recipeResults = recipeDatabase.filter(recipe => 
    recipe.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // Combinaison des résultats (limités à 5)
  return [...foodResults, ...recipeResults].slice(0, 5);
};

/**
 * Récupère un aliment par son ID
 * @param id ID de l'aliment
 * @returns Aliment trouvé ou undefined
 */
export const getFoodById = (id: string): FoodItem | undefined => {
  // Chercher d'abord dans les aliments simples
  const foodItem = foodDatabase.find(food => food.id === id);
  if (foodItem) return foodItem;
  
  // Puis chercher dans les recettes
  return recipeDatabase.find(recipe => recipe.id === id);
};

/**
 * Récupère tous les aliments de la base de données
 * @returns Liste de tous les aliments
 */
export const getAllFoods = (): FoodItem[] => {
  return [...foodDatabase, ...recipeDatabase];
};

/**
 * Vérifie si un aliment existe déjà (par nom)
 * @param name Nom de l'aliment à vérifier
 * @returns Booléen indiquant si l'aliment existe déjà
 */
const foodExists = (name: string): boolean => {
  const normalizedName = name.toLowerCase().trim();
  return foodDatabase.some(food => food.name.toLowerCase().trim() === normalizedName) || 
         recipeDatabase.some(recipe => recipe.name.toLowerCase().trim() === normalizedName);
};

/**
 * Ajoute un nouvel aliment à la base de données
 * @param newFood Nouvel aliment à ajouter
 * @returns Booléen indiquant si l'ajout a réussi
 */
export const addFoodItem = (newFood: FoodItem): boolean => {
  if (foodExists(newFood.name)) return false;
  
  // Ajouter l'aliment à la base de données
  foodDatabase.push(newFood);
  
  // Mettre à jour le moteur de recherche
  const newFoodSearchEngine = new FuzzySearch(foodDatabase, ['name', 'category'], {
    threshold: 0.2,
    caseSensitive: false,
    maxResults: 5,
  });
  
  // Remplacer l'ancien moteur de recherche par le nouveau
  Object.assign(foodSearchEngine, newFoodSearchEngine);
  
  return true;
};

/**
 * Crée une nouvelle recette
 * @param newRecipe Nouvelle recette à ajouter
 * @returns Booléen indiquant si l'ajout a réussi
 */
export const createRecipe = (newRecipe: RecipeItem): boolean => {
  if (foodExists(newRecipe.name)) return false;
  
  // Ajouter la recette à la base de données
  recipeDatabase.push(newRecipe);
  
  return true;
};

/**
 * Récupère les ingrédients d'une recette
 * @param recipeId ID de la recette
 * @returns Liste des ingrédients ou undefined si la recette n'existe pas
 */
export const getRecipeIngredients = (recipeId: string): RecipeIngredient[] | undefined => {
  const recipe = recipeDatabase.find(r => r.id === recipeId);
  return recipe?.ingredients;
};

/**
 * Met à jour un aliment existant dans la base de données
 * @param updatedFood Aliment mis à jour
 * @returns Booléen indiquant si la mise à jour a réussi
 */
export const updateFoodItem = (updatedFood: FoodItem): boolean => {
  // Vérifier si c'est une recette
  if (updatedFood.isRecipe) {
    const index = recipeDatabase.findIndex(recipe => recipe.id === updatedFood.id);
    if (index === -1) return false;
    
    // Mettre à jour la recette
    recipeDatabase[index] = updatedFood as RecipeItem;
    return true;
  }
  
  // C'est un aliment simple
  const index = foodDatabase.findIndex(food => food.id === updatedFood.id);
  if (index === -1) return false;
  
  // Mettre à jour l'aliment dans la base de données
  foodDatabase[index] = { ...updatedFood };
  
  // Mettre à jour le moteur de recherche
  const newFoodSearchEngine = new FuzzySearch(foodDatabase, ['name', 'category'], {
    threshold: 0.2,
    caseSensitive: false,
    maxResults: 5,
  });
  
  // Remplacer l'ancien moteur de recherche par le nouveau
  Object.assign(foodSearchEngine, newFoodSearchEngine);
  
  return true;
};
