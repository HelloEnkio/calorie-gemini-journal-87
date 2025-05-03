
// Food and nutrition types
export interface MacroNutrients {
  protein: number;  // in grams
  carbs: number;    // in grams
  fat: number;      // in grams
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

// Workout types
export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;  // in minutes
  caloriesBurned?: number;
  notes?: string;
  timestamp: string;
}

// Weight tracking
export interface WeightEntry {
  id: string;
  weight: number;  // in kg
  timestamp: string;
  notes?: string;
}

// User stats and goals
export interface UserGoals {
  dailyCalories: number;
  macros?: MacroNutrients;
  weeklyWorkouts?: number;
  targetWeight?: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number; // 0-100
  maxProgress?: number;
  category: 'nutrition' | 'fitness' | 'consistency' | 'weight';
  level: 'bronze' | 'silver' | 'gold';
}

// App general types
export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  foodEntries: FoodEntry[];
  workouts: WorkoutEntry[];
  weight?: WeightEntry;
}

export interface WeeklyStats {
  startDate: string;
  endDate: string;
  averageCalories: number;
  averageMacros: MacroNutrients;
  totalWorkouts: number;
  weightChange?: number;
  caloriesBurned: number;
}

// Gemini API types
export interface GeminiNutritionResponse {
  success: boolean;
  foodName?: string;
  calories?: number;
  macros?: MacroNutrients;
  errorMessage?: string;
}
