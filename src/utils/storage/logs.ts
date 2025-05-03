
import { DailyLog } from "@/types";
import { formatDateKey, getAllLogs, DAILY_LOGS_KEY } from "./core";

// Get today's log or create a new one
export const getTodaysLog = (): DailyLog => {
  return getLogForDate(formatDateKey());
};

// Get log for a specific date
export const getLogForDate = (dateKey: string): DailyLog => {
  const allLogs = getAllLogs();
  
  const dayLog = allLogs.find(log => log.date === dateKey);
  
  if (dayLog) {
    return dayLog;
  }
  
  // Create new log for the date
  const newLog: DailyLog = {
    date: dateKey,
    totalCalories: 0,
    totalMacros: { protein: 0, carbs: 0, fat: 0 },
    foodEntries: [],
    workouts: [],
  };
  
  // Save and return the new log
  saveDailyLog(newLog);
  return newLog;
};

// Save/update a daily log
export const saveDailyLog = (log: DailyLog): void => {
  const allLogs = getAllLogs();
  const logIndex = allLogs.findIndex(l => l.date === log.date);
  
  if (logIndex >= 0) {
    allLogs[logIndex] = log;
  } else {
    allLogs.push(log);
  }
  
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(allLogs));
};

// Get logs for a date range
export const getLogsInDateRange = (startDate: string, endDate: string): DailyLog[] => {
  return getAllLogs().filter(log => log.date >= startDate && log.date <= endDate);
};

// Get logs for last N days
export const getLogsForLastDays = (days: number): DailyLog[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return getLogsInDateRange(formatDateKey(startDate), formatDateKey(endDate));
};
