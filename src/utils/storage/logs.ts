
import { DailyLog, FoodEntry, WorkoutEntry, WeightEntry } from '@/types';
import { format } from 'date-fns';

const DAILY_LOGS_KEY = 'nutrition-tracker-daily-logs';

export const getAllLogs = (): DailyLog[] => {
  try {
    const logsJson = localStorage.getItem(DAILY_LOGS_KEY);
    
    if (!logsJson) {
      return [];
    }
    
    return JSON.parse(logsJson);
  } catch (error) {
    console.error("Error loading logs:", error);
    return [];
  }
};

export const getDailyLog = (date: Date | string): DailyLog => {
  const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
  const logs = getAllLogs();
  
  const existingLog = logs.find(log => log.date === dateKey);
  
  if (existingLog) {
    return existingLog;
  }
  
  return {
    date: dateKey,
    totalCalories: 0,
    totalMacros: { protein: 0, carbs: 0, fat: 0 },
    foodEntries: [],
    workouts: [],
    habits: {}
  };
};

export const updateDailyLog = (date: Date | string, updatedLog: DailyLog): void => {
  const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
  const logs = getAllLogs();
  
  const logIndex = logs.findIndex(log => log.date === dateKey);
  
  if (logIndex >= 0) {
    logs[logIndex] = updatedLog;
  } else {
    logs.push(updatedLog);
  }
  
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
};

// Additional helper functions
export const getTodaysLog = (): DailyLog => {
  return getDailyLog(new Date());
};

export const getLogForDate = (dateKey: string): DailyLog => {
  return getDailyLog(dateKey);
};

export const saveDailyLog = (log: DailyLog): void => {
  updateDailyLog(log.date, log);
};

// Helpers for handling food entries
// Support both function signatures for backward compatibility
export const addFoodEntry = (dateOrEntry: Date | FoodEntry, entry?: FoodEntry): void => {
  // If only one argument is provided, assume it's the entry and use today's date
  if (!entry) {
    const entry = dateOrEntry as FoodEntry;
    const entryDate = new Date(entry.timestamp);
    const dateKey = format(entryDate, 'yyyy-MM-dd');
    const dayLog = getDailyLog(dateKey);
    
    // Add the entry
    dayLog.foodEntries = [...dayLog.foodEntries, entry];
    
    // Recalculate totals
    dayLog.totalCalories = dayLog.foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    
    // Recalculate macros
    dayLog.totalMacros = dayLog.foodEntries.reduce(
      (sum, entry) => ({
        protein: sum.protein + entry.macros.protein,
        carbs: sum.carbs + entry.macros.carbs,
        fat: sum.fat + entry.macros.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
    
    updateDailyLog(dateKey, dayLog);
  } else {
    // Original function signature with date and entry
    const date = dateOrEntry as Date;
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayLog = getDailyLog(dateKey);
    
    // Add the entry
    dayLog.foodEntries = [...dayLog.foodEntries, entry];
    
    // Recalculate totals
    dayLog.totalCalories = dayLog.foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    
    // Recalculate macros
    dayLog.totalMacros = dayLog.foodEntries.reduce(
      (sum, entry) => ({
        protein: sum.protein + entry.macros.protein,
        carbs: sum.carbs + entry.macros.carbs,
        fat: sum.fat + entry.macros.fat,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
    
    updateDailyLog(dateKey, dayLog);
  }
};

export const removeFoodEntry = (date: Date | string, entryId: string): void => {
  const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
  const dayLog = getDailyLog(dateKey);
  
  // Remove the entry
  dayLog.foodEntries = dayLog.foodEntries.filter(entry => entry.id !== entryId);
  
  // Recalculate totals
  dayLog.totalCalories = dayLog.foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  
  // Recalculate macros
  dayLog.totalMacros = dayLog.foodEntries.reduce(
    (sum, entry) => ({
      protein: sum.protein + entry.macros.protein,
      carbs: sum.carbs + entry.macros.carbs,
      fat: sum.fat + entry.macros.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );
  
  updateDailyLog(dateKey, dayLog);
};

// Export the updateFoodEntry function
export const updateFoodEntry = (entryId: string, updatedEntry: FoodEntry): boolean => {
  const logs = getAllLogs();
  
  // Look for the entry in all logs
  for (const log of logs) {
    const entryIndex = log.foodEntries.findIndex(entry => entry.id === entryId);
    
    if (entryIndex >= 0) {
      // Update the entry
      log.foodEntries[entryIndex] = updatedEntry;
      
      // Recalculate totals
      log.totalCalories = log.foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
      
      // Recalculate macros
      log.totalMacros = log.foodEntries.reduce(
        (sum, entry) => ({
          protein: sum.protein + entry.macros.protein,
          carbs: sum.carbs + entry.macros.carbs,
          fat: sum.fat + entry.macros.fat,
        }),
        { protein: 0, carbs: 0, fat: 0 }
      );
      
      // Save the updated log
      updateDailyLog(log.date, log);
      return true;
    }
  }
  
  return false;
};

// Helpers for handling workout entries
export const addWorkoutEntry = (dateOrEntry: Date | WorkoutEntry, entry?: WorkoutEntry): void => {
  // Support both function signatures for backward compatibility
  if (!entry) {
    const entry = dateOrEntry as WorkoutEntry;
    const entryDate = new Date(entry.timestamp);
    const dateKey = format(entryDate, 'yyyy-MM-dd');
    const dayLog = getDailyLog(dateKey);
    
    // Add the entry
    dayLog.workouts = [...dayLog.workouts, entry];
    
    updateDailyLog(dateKey, dayLog);
  } else {
    const date = dateOrEntry as Date;
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayLog = getDailyLog(dateKey);
    
    // Add the entry
    dayLog.workouts = [...dayLog.workouts, entry];
    
    updateDailyLog(dateKey, dayLog);
  }
};

export const removeWorkoutEntry = (date: Date, entryId: string): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getDailyLog(dateKey);
  
  // Remove the entry
  dayLog.workouts = dayLog.workouts.filter(entry => entry.id !== entryId);
  
  updateDailyLog(dateKey, dayLog);
};

// Add weight entry with flexible signature
export const addWeightEntry = (dateOrEntry: Date | WeightEntry, entry?: WeightEntry): void => {
  // Support both function signatures for backward compatibility
  if (!entry) {
    // If only one argument is provided, assume it's the entry
    const entry = dateOrEntry as WeightEntry;
    const entryDate = new Date(entry.timestamp);
    const dateKey = format(entryDate, 'yyyy-MM-dd');
    const dayLog = getDailyLog(dateKey);
    
    dayLog.weight = entry;
    saveDailyLog(dayLog);
  } else {
    // Original function signature
    const date = dateOrEntry as Date;
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayLog = getDailyLog(dateKey);
    
    dayLog.weight = entry;
    saveDailyLog(dayLog);
  }
};

// Helper functions for date ranges
export const getLogsForLastDays = (days: number): DailyLog[] => {
  const logs = getAllLogs();
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);
  
  return logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= today;
  });
};

export const getLogsInDateRange = (startDate: string, endDate: string): DailyLog[] => {
  const logs = getAllLogs();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= start && logDate <= end;
  });
};
