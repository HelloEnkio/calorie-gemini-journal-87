
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
  saveDailyLog,
  addFoodEntry,
  removeFoodEntry,
  updateFoodEntry,
  addWorkoutEntry,
  removeWorkoutEntry,
  addWeightEntry
} from './logs';
export {
  getAchievements,
  checkAndUpdateAchievements
} from './achievements';
export {
  getUserGoals,
  saveUserGoals
} from './goals';

// Export the generate ID function for convenience
export { generateId } from './core';
