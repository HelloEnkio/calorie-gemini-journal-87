
import { FoodEntry, WorkoutEntry, WeightEntry } from "@/types";
import { generateId } from "./core";
import { getTodaysLog, saveDailyLog } from "./logs";

// Add food entry
export const addFoodEntry = (entry: FoodEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.foodEntries.push(entry);
  
  // Update totals
  todayLog.totalCalories += entry.calories;
  todayLog.totalMacros.protein += entry.macros.protein;
  todayLog.totalMacros.carbs += entry.macros.carbs;
  todayLog.totalMacros.fat += entry.macros.fat;
  
  saveDailyLog(todayLog);
};

// Remove food entry
export const removeFoodEntry = (entryId: string): void => {
  const todayLog = getTodaysLog();
  const entryIndex = todayLog.foodEntries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex >= 0) {
    const entry = todayLog.foodEntries[entryIndex];
    
    // Update totals
    todayLog.totalCalories -= entry.calories;
    todayLog.totalMacros.protein -= entry.macros.protein;
    todayLog.totalMacros.carbs -= entry.macros.carbs;
    todayLog.totalMacros.fat -= entry.macros.fat;
    
    // Remove entry
    todayLog.foodEntries.splice(entryIndex, 1);
    saveDailyLog(todayLog);
  }
};

// Add workout entry
export const addWorkoutEntry = (entry: WorkoutEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.workouts.push(entry);
  saveDailyLog(todayLog);
};

// Remove workout entry
export const removeWorkoutEntry = (entryId: string): void => {
  const todayLog = getTodaysLog();
  todayLog.workouts = todayLog.workouts.filter(entry => entry.id !== entryId);
  saveDailyLog(todayLog);
};

// Add weight entry
export const addWeightEntry = (entry: WeightEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.weight = entry;
  saveDailyLog(todayLog);
};
