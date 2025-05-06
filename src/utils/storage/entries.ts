
import { FoodEntry, WorkoutEntry, WeightEntry } from "@/types";
import { generateId } from "./core";
import { 
  getTodaysLog, 
  saveDailyLog, 
  getLogForDate,
  addFoodEntry as addFood,
  removeFoodEntry as removeFood,
  addWorkoutEntry as addWorkout,
  removeWorkoutEntry as removeWorkout
} from "./logs";

// Add food entry - using wrapper to avoid naming conflicts
export const addFoodEntry = (entry: FoodEntry): void => {
  const today = new Date();
  addFood(today, entry);
};

// Remove food entry
export const removeFoodEntry = (entryId: string): void => {
  const today = new Date();
  removeFood(today, entryId);
};

// Update food entry
export const updateFoodEntry = (entryId: string, updatedEntry: FoodEntry): boolean => {
  // Get log by date from the entry's timestamp
  const entryDate = new Date(updatedEntry.timestamp);
  const dateKey = entryDate.toISOString().split('T')[0];
  const log = getLogForDate(dateKey);
  
  const entryIndex = log.foodEntries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex >= 0) {
    const oldEntry = log.foodEntries[entryIndex];
    
    // Update totals (subtract old values, add new values)
    log.totalCalories = log.totalCalories - oldEntry.calories + updatedEntry.calories;
    log.totalMacros.protein = log.totalMacros.protein - oldEntry.macros.protein + updatedEntry.macros.protein;
    log.totalMacros.carbs = log.totalMacros.carbs - oldEntry.macros.carbs + updatedEntry.macros.carbs;
    log.totalMacros.fat = log.totalMacros.fat - oldEntry.macros.fat + updatedEntry.macros.fat;
    
    // Update entry
    log.foodEntries[entryIndex] = updatedEntry;
    
    // Save changes
    saveDailyLog(log);
    return true;
  }
  
  return false;
};

// Add workout entry
export const addWorkoutEntry = (entry: WorkoutEntry): void => {
  const today = new Date();
  addWorkout(today, entry);
};

// Remove workout entry
export const removeWorkoutEntry = (entryId: string): void => {
  const today = new Date();
  removeWorkout(today, entryId);
};

// Add weight entry
export const addWeightEntry = (entry: WeightEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.weight = entry;
  saveDailyLog(todayLog);
};
