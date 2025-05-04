
import { FoodEntry, WorkoutEntry, WeightEntry } from "@/types";
import { generateId } from "./core";
import { getTodaysLog, saveDailyLog, getLogForDate } from "./logs";

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
