export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  foodEntries: FoodEntry[];
  workouts: WorkoutEntry[];
  weight?: WeightEntry;
  habits?: Record<string, boolean>;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
}

export interface WorkoutEntry {
  id: string;
  name: string;
  duration: number;
  type: string;
  timestamp: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
  photoUrl?: string;
}

export interface UserGoals {
  dailyCalories: number;
  macros: MacroNutrients;
}

// If you have a category in the Achievement type, make sure it's defined here
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  level: number;
  category: string; // Add this field
  progress?: number;
  maxProgress?: number;
}
