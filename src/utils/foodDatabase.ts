
// Main export file that re-exports all food database functionality
export { searchFoods, foodExists, updateSearchEngine } from './food/foodSearch';
export { getFoodById, getAllFoods, addFoodItem, createRecipe, getRecipeIngredients, updateFoodItem } from './food/foodOperations';
export type { FoodItem, RecipeItem, RecipeIngredient } from '@/types';
