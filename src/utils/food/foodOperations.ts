
import { FoodItem, RecipeItem, RecipeIngredient, MeasureUnit } from '@/types';
import { foodDatabase, recipeDatabase } from './foodData';
import { updateSearchEngine, foodExists } from './foodSearch';

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
 * Ajoute un nouvel aliment à la base de données
 * @param newFood Nouvel aliment à ajouter
 * @returns Booléen indiquant si l'ajout a réussi
 */
export const addFoodItem = (newFood: FoodItem): boolean => {
  if (foodExists(newFood.name)) return false;
  
  // Ajouter l'aliment à la base de données
  foodDatabase.push(newFood);
  
  // Mettre à jour le moteur de recherche
  updateSearchEngine();
  
  return true;
};

/**
 * Crée une nouvelle recette
 * @param newRecipe Nouvelle recette à ajouter
 * @returns Booléen indiquant si l'ajout a réussi
 */
export const createRecipe = (newRecipe: RecipeItem): boolean => {
  if (foodExists(newRecipe.name)) return false;
  
  // S'assurer que tous les ingrédients ont une unité de mesure
  const validatedRecipe: RecipeItem = {
    ...newRecipe,
    ingredients: newRecipe.ingredients.map(ingredient => ({
      ...ingredient,
      unit: ingredient.unit || MeasureUnit.GRAMS // Utiliser MeasureUnit.GRAMS au lieu de 'g'
    }))
  };
  
  // Ajouter la recette à la base de données
  recipeDatabase.push(validatedRecipe);
  
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
  updateSearchEngine();
  
  return true;
};
