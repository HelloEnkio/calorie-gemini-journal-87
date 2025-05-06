
// Type pour les macronutriments
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Type pour les données d'un aliment/repas
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
  weight?: number;
  geminiData?: {
    prompt: string;
    response: any;
  };
}

// Type pour les entrées de poids
export interface WeightEntry {
  weight: number;
  timestamp: string;
  photoUrl?: string;
  notes?: string;
}

// Type pour les activités sportives
export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  caloriesBurned?: number;
  timestamp: string;
  notes?: string;
}

// Type pour les habitudes
export interface HabitEntry {
  id: string;
  completed: boolean;
  timestamp: string;
  notes?: string;
}

// Type pour la configuration d'une habitude
export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency?: "daily" | "weekly";
  streak?: number;
  active: boolean;
  createdAt: string;
}

// Type pour les statistiques d'une habitude
export interface HabitStats {
  habitId: string;
  streak: number; // Current streak
  longestStreak: number;
  completionRates: {
    week: number; // Rate in the last 7 days (0-100)
    month: number; // Rate in the last 30 days (0-100)
    threeMonths: number; // Rate in the last 90 days (0-100)
    sixMonths: number; // Rate in the last 180 days (0-100)
    year: number; // Rate in the last 365 days (0-100)
  };
}

// Type pour les objectifs de l'utilisateur
export interface UserGoals {
  dailyCalories: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

// Type pour les données journalières
export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  foodEntries: FoodEntry[];
  workouts: WorkoutEntry[];
  weight?: WeightEntry;
  habits: {
    [habitId: string]: HabitEntry;
  };
}

// Type pour les succès/badges
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
  level: 1 | 2 | 3;
}
