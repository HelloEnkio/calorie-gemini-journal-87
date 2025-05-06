
// Export storage utility functions
export * from './core';
export { 
  getDailyLog, 
  updateDailyLog, 
  getTodaysLog, 
  getLogForDate,
  getLogsForLastDays,
  getLogsInDateRange,
  getAllLogs,
  saveDailyLog
} from './logs';
export {
  addFoodEntry,
  removeFoodEntry,
  updateFoodEntry,
  addWorkoutEntry,
  removeWorkoutEntry,
  addWeightEntry
} from './entries';
export * from './achievements';
export * from './goals';

// Export the generate ID function for convenience
export { generateId } from './core';
