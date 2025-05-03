
// Extend the existing types to include weight and geminiData

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: Macros;
  timestamp: string;
  weight?: number;
  geminiData?: {
    prompt: string;
    response: any;
  };
}

export interface WeightEntry {
  weight: number;
  timestamp: string;
  notes?: string;
}

export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  caloriesBurned?: number;
  timestamp: string;
  notes?: string;
}

export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: Macros;
  foodEntries: FoodEntry[];
  workouts: WorkoutEntry[];
  weight?: WeightEntry;
}

export interface UserGoals {
  dailyCalories: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  targetWeight?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface GeminiNutritionResponse {
  success: boolean;
  foodName?: string;
  calories?: number;
  macros?: Macros;
  errorMessage?: string;
}
