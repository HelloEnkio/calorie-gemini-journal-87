
// Types for the application

// Food entry with macros and calories
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

// Macro nutrients (protein, carbs, fat)
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Weight entry
export interface WeightEntry {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
  photoUrl?: string;
}

// Workout entry
export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  caloriesBurned?: number;
  notes?: string;
  timestamp: string;
}

// Daily log with all entries for a specific day
export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  foodEntries: FoodEntry[];
  weight?: WeightEntry;
  workouts: WorkoutEntry[];
}

// User goals for calories, macros, etc.
export interface UserGoals {
  dailyCalories: number;
  macros?: MacroNutrients;
  targetWeight?: number;
  macroPercentages?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Achievement data
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  level: 1 | 2 | 3;
  category: 'nutrition' | 'fitness' | 'consistency' | 'weight';
}

// Gemini analysis result
export interface GeminiAnalysisResult {
  success: boolean;
  foodName?: string;
  calories?: number;
  macros?: MacroNutrients;
  errorMessage?: string;
  confidence?: number; // Added from the other definition
}
