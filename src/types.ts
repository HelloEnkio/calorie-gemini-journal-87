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

// Add missing exports and type definitions
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  weight?: number;
}

export interface RecipeItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  ingredients: RecipeIngredient[];
  servings: number;
}

export interface RecipeIngredient {
  id: string;
  foodId: string;
  name: string;
  amount: number;
  unit: MeasureUnit;
  calories: number;
  macros: MacroNutrients;
}

export enum MeasureUnit {
  GRAMS = 'g',
  MILLILITERS = 'ml',
  PIECES = 'pcs',
  TABLESPOON = 'tbsp',
  TEASPOON = 'tsp'
}

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  frequency: 'daily' | 'weekly';
  goal?: number;
  unit?: string;
  color?: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  value?: number;
}

export interface HabitStats {
  habitId: string;
  completedCount: number;
  totalCount: number;
  streakCurrent: number;
  streakLongest: number;
  averageValue?: number;
}

// Update FoodEntry to include weight and make geminiData optional
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
  weight?: number;
  geminiData?: {
    ingredients?: string[];
    category?: string;
    healthScore?: number;
    suggestions?: string[];
  };
}

// Update WorkoutEntry to include additional fields
export interface WorkoutEntry {
  id: string;
  name: string;
  type: string;
  duration: number;
  timestamp: string;
  caloriesBurned?: number;
  notes?: string;
}

// Update WeightEntry to include id
export interface WeightEntry {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
  photoUrl?: string;
}

// Update Achievement to include category
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  category: string;
}
