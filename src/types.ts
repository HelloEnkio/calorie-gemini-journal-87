
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  foodEntries: FoodEntry[];
  workouts: WorkoutEntry[];
  weight?: WeightEntry;
  habits?: Record<string, HabitEntry>;
}

export interface UserGoals {
  dailyCalories: number;
  macros?: MacroNutrients;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  weight?: number;
  category?: string;
  isRecipe?: boolean;
}

export enum MeasureUnit {
  GRAMS = 'g',
  MILLILITERS = 'ml',
  PIECES = 'pcs',
  TABLESPOON = 'tbsp',
  TEASPOON = 'tsp',
  CUP = 'cup',
  OUNCE = 'oz',
  PIECE = 'piece'
}

export interface RecipeItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  ingredients: RecipeIngredient[];
  servings: number;
  weight?: number;
  category?: string;
  isRecipe: boolean;
}

export interface RecipeIngredient {
  id: string;
  foodId: string;
  name: string;
  amount: number;
  quantity?: number;
  unit: MeasureUnit;
  calories: number;
  macros: MacroNutrients;
  foodItemId?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  goal?: number;
  unit?: string;
  color?: string;
  active: boolean;
  streak?: number;
  createdAt: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  completed: boolean;
  timestamp: string;
  date?: string;
  notes?: string;
  value?: number;
}

export interface HabitStats {
  habitId: string;
  completedCount: number;
  totalCount: number;
  streakCurrent: number;
  streakLongest: number;
  averageValue?: number;
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

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
  weight?: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  geminiData?: {
    ingredients?: string[];
    category?: string;
    healthScore?: number;
    suggestions?: string[];
    prompt?: string;
    response?: any;
  };
}

export interface WorkoutEntry {
  id: string;
  name: string;
  type: string;
  duration: number;
  timestamp: string;
  caloriesBurned?: number;
  notes?: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
  photoUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  name: string;
  description: string;
  icon: string;
  unlocked?: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  level: 'bronze' | 'silver' | 'gold' | 1 | 2 | 3;
  category: string;
}
