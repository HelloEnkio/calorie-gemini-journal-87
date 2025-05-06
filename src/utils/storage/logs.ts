
import { DailyLog, FoodEntry, WorkoutEntry } from '@/types';
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

// Helpers for handling food entries
export const addFoodEntry = (date: Date, entry: FoodEntry): void => {
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
};

export const removeFoodEntry = (date: Date, entryId: string): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
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

// Helpers for handling workout entries
export const addWorkoutEntry = (date: Date, entry: WorkoutEntry): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getDailyLog(dateKey);
  
  // Add the entry
  dayLog.workouts = [...dayLog.workouts, entry];
  
  updateDailyLog(dateKey, dayLog);
};

export const removeWorkoutEntry = (date: Date, entryId: string): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getDailyLog(dateKey);
  
  // Remove the entry
  dayLog.workouts = dayLog.workouts.filter(entry => entry.id !== entryId);
  
  updateDailyLog(dateKey, dayLog);
};
