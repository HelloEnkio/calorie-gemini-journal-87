
import { FoodItem, RecipeItem } from '@/types';
import { FuzzySearch } from '../fuzzySearch';
import { foodDatabase, recipeDatabase } from './foodData';

// Initialiser le moteur de recherche floue avec les noms des aliments
let foodSearchEngine = new FuzzySearch(foodDatabase, ['name', 'category'], {
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
 * Vérifie si un aliment existe déjà (par nom)
 * @param name Nom de l'aliment à vérifier
 * @returns Booléen indiquant si l'aliment existe déjà
 */
export const foodExists = (name: string): boolean => {
  const normalizedName = name.toLowerCase().trim();
  return foodDatabase.some(food => food.name.toLowerCase().trim() === normalizedName) || 
         recipeDatabase.some(recipe => recipe.name.toLowerCase().trim() === normalizedName);
};

/**
 * Met à jour le moteur de recherche
 */
export const updateSearchEngine = () => {
  const newFoodSearchEngine = new FuzzySearch(foodDatabase, ['name', 'category'], {
    threshold: 0.2,
    caseSensitive: false,
    maxResults: 5,
  });
  
  // Remplacer l'ancien moteur de recherche par le nouveau
  Object.assign(foodSearchEngine, newFoodSearchEngine);
};
