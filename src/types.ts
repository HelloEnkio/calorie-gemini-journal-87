
// Types pour les macronutriments
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Type pour un élément alimentaire (aliment simple)
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  weight?: number;
  category: string;
  isRecipe?: boolean;
}

// Type pour un ingrédient dans une recette
export type MeasureUnit = "g" | "ml" | "cup" | "tbsp" | "tsp" | "oz" | "piece";

// Type pour un ingrédient dans une recette
export interface RecipeIngredient {
  foodItemId: string;
  quantity: number;
  unit: MeasureUnit;
  name: string;
}

// Type pour une recette
export interface RecipeItem extends FoodItem {
  ingredients: RecipeIngredient[];
  isRecipe: true;
}

// Type pour une entrée de journal alimentaire
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
  weight?: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  geminiData?: {
    prompt: string;
    response: any;
  };
}

// Type pour une entrée d'habitude
export interface HabitEntry {
  id?: string;
  completed: boolean;
  timestamp: string;
  notes?: string;
}

// Type pour une habitude
export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  active: boolean;
  streak?: number;
  frequency?: string;
  createdAt?: string;
}

// Type pour les statistiques d'habitude
export interface HabitStats {
  habitId: string;
  streak: number;
  longestStreak: number;
  completionRates: {
    week: number;
    month: number;
    threeMonths: number;
    sixMonths?: number;
    year: number;
  };
}

// Type pour une entrée de poids
export interface WeightEntry {
  id?: string;
  weight: number;
  timestamp: string;
  notes?: string;
  photoUrl?: string;
}

// Type pour une entrée d'exercice
export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  caloriesBurned?: number;
  timestamp: string;
  notes?: string;
}

// Type pour un journal quotidien
export interface DailyLog {
  date: string;
  foodEntries: FoodEntry[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  habits?: Record<string, HabitEntry>;
  weight?: WeightEntry;
  workouts: WorkoutEntry[];
}

// Type pour un objectif nutritionnel
export interface UserGoals {
  dailyCalories: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  targetWeight?: number;
  macroPercentages?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Type pour une réalisation (achievement)
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  level: 1 | 2 | 3;  // 1=bronze, 2=silver, 3=gold
  category: 'nutrition' | 'fitness' | 'consistency' | 'weight';
}
