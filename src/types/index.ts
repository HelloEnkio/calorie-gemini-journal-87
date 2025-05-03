
// Type pour les macronutriments
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

// Type pour un repas ou un aliment
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  timestamp: string;
  weight?: number;
  mealType?: string;
  geminiData?: {
    prompt: string;
    response: any;
  };
}

// Type pour une entrée de poids
export interface WeightEntry {
  id: string;
  weight: number;
  timestamp: string;
  notes?: string;
}

// Type pour une activité sportive
export interface WorkoutEntry {
  id: string;
  type: string;
  duration: number;
  timestamp: string;
  caloriesBurned?: number;
  notes?: string;
}

// Type pour un succès
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "nutrition" | "fitness" | "consistency" | "weight";
  unlocked: boolean;
  level: "bronze" | "silver" | "gold";
  progress?: number;
  maxProgress?: number;
  date?: string;
}

// Type pour le journal quotidien
export interface DailyLog {
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  foodEntries: FoodEntry[];
  workouts: WorkoutEntry[];
  weight?: WeightEntry;
}

// Type pour les objectifs utilisateur
export interface UserGoals {
  dailyCalories: number;
  macros?: MacroNutrients;
  macroPercentages?: MacroNutrients;
}

// Type pour la réponse de l'analyse Gemini
export interface GeminiAnalysisResult {
  success: boolean;
  foodName?: string;
  calories?: number;
  macros?: MacroNutrients;
  errorMessage?: string;
}
